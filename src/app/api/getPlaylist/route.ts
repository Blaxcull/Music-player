import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

interface Song {
  _id: string;
  title: string;
  artist: string;
  duration: number;
  songURL: string;
  coverArt: string;
  uploadedAt: string;
  liked: number;
  playlist: string[];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const playlistName = searchParams.get("playlistName");

  if (!userId || !playlistName) {
    return NextResponse.json({ 
      error: "Missing userId or playlistName" 
    }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("music");

    console.log(`Fetching playlist: ${playlistName} for user: ${userId}`);

    // Get user with songs that have this playlist name in their playlists array
    const user = await db.collection("users").findOne(
      { _id: parseInt(userId) },
      { projection: { songs: 1 } }
    );

    if (!user || !user.songs) {
      return NextResponse.json({
        success: true,
        playlist: {
          name: playlistName,
          songs: [],
          songCount: 0
        }
      });
    }

    // Filter songs that have this playlist name in their playlists array
    const playlistSongs = (user.songs as Song[]).filter((song: Song) => 
      song.playlist && song.playlist.includes(playlistName)
    );

    console.log(`Found ${playlistSongs.length} songs in playlist:`, playlistSongs);

    return NextResponse.json({
      success: true,
      playlist: {
        name: playlistName,
        songs: playlistSongs,
        songCount: playlistSongs.length
      }
    });

  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json({ 
      error: "Failed to fetch playlist" 
    }, { status: 500 });
  }
}

