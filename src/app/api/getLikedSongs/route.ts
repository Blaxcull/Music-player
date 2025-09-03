import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("music");

    // Check if users collection exists and has data
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    const user = await db.collection("users").findOne(
      { _id: Number(userId) },
      { projection: { songs: 1, _id: 0 } }
    );

    console.log('User data:', user); // Debug log

    if (!user || !user.songs) {
      return NextResponse.json({ 
        songs: [],
        message: "No user found or no songs in database",
        userId: Number(userId)
      });
    }

    const likedSongs = user.songs.filter(song => song.liked === 1);

    console.log('Filtered liked songs:', likedSongs); // Debug log

    return NextResponse.json({ 
      songs: likedSongs,
      totalSongs: user.songs.length,
      likedCount: likedSongs.length
    });

  } catch (error) {
    console.error('Error in getLikedSongs:', error);
    return NextResponse.json({ 
      error: "Database error", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
