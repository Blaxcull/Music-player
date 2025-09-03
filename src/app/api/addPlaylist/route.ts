import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, playlistName, fileName } = await req.json();

  if (!userId || !playlistName || !fileName) {
    return NextResponse.json({ 
      error: "Missing userId, playlistName, or fileName" 
    }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('music');

    // Add playlist name to the song's playlists array
await db.collection("users").updateOne(
  { _id: Number(userId), "songs.title": fileName },
  {
    $addToSet: { "songs.$.playlist": playlistName }
  }
);


    // Also update the user's fields for backward compatibility
    await db.collection("users").updateOne(
      { _id: Number(userId) },
      { $addToSet: { [`fields.${playlistName}`]: fileName } },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Song added to playlist: ${playlistName}` 
    });

  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return NextResponse.json({ 
      error: "Failed to add song to playlist" 
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const playlistId = searchParams.get("playlistId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("music");

    const playlists = await db.collection("songs")
      .aggregate([
        { $match: { userId: Number(userId) } },
        { $unwind: "$playlists" },
        { $group: { _id: "$playlists" } },
        { $project: { name: "$_id" } },
        { $sort: { name: 1 } }
      ])
      .toArray();

    // Also get from user fields for backward compatibility
    const user = await db.collection("users").findOne(
      { _id: Number(userId) },
      { projection: { fields: 1 } }
    );

    const userPlaylists = user?.fields ? Object.keys(user.fields) : [];
    
    // Combine both sources and remove duplicates
    const allPlaylists = [...new Set([
      ...playlists.map(p => p.name),
      ...userPlaylists
    ])];

    // If a playlistId was provided, check if it exists
    if (playlistId) {
      const exists = allPlaylists.includes(playlistId);
      return NextResponse.json({
        success: true,
        exists,
        playlistId,
      });
    }

    // Otherwise return all playlists
    return NextResponse.json({ 
      success: true, 
      playlists: allPlaylists
    });

  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json({ 
      error: "Failed to fetch playlists" 
    }, { status: 500 });
  }
}

