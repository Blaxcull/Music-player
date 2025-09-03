import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, playlistName } = await req.json();

  if (!userId || !playlistName) {
    return NextResponse.json({ 
      error: "Missing userId or playlistName" 
    }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('music');

    // Remove this playlist name from all songs' playlists arrays
    const result = await db.collection("songs").updateMany(
      { userId: Number(userId) },
      { $pull: { playlists: playlistName } }
    );

    // Also remove from user's fields for backward compatibility
    await db.collection("users").updateOne(
      { _id: Number(userId) },
      { $unset: { [`fields.${playlistName}`]: "" } }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Playlist deleted: ${playlistName}`,
      songsUpdated: result.modifiedCount
    });

  } catch (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json({ 
      error: "Failed to delete playlist" 
    }, { status: 500 });
  }
}

