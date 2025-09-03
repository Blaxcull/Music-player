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

    // Remove playlist name from the song's playlists array
    const result = await db.collection("songs").updateOne(
      { 
        fileName: fileName,
        userId: Number(userId)
      },
      { 
        $pull: { playlists: playlistName }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        error: "Song not found" 
      }, { status: 404 });
    }

    // Also update the user's fields for backward compatibility
    await db.collection("users").updateOne(
      { _id: Number(userId) },
      { $pull: { [`fields.${playlistName}`]: fileName } }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Song removed from playlist: ${playlistName}` 
    });

  } catch (error) {
    console.error("Error removing song from playlist:", error);
    return NextResponse.json({ 
      error: "Failed to remove song from playlist" 
    }, { status: 500 });
  }
}
