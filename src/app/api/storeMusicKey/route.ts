import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";



interface Song {
  title: string;
  artist: string;
  duration: number;
  songURL: string;
  coverArt: string;
  uploadedAt: Date;
  liked: number;
  playlist: Array<number>;
}


export async function POST(req: Request) {
  try {
    const { userId, songURL, Title, Artist, Duration, coverArt} = await req.json();

    if (!userId || !songURL || !coverArt) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

function convertS3Url(url:string) {
  const decoded = decodeURIComponent(url.split("?")[0]);
  // Replace spaces with +
  return decoded.replace(/ /g, "+");
}
const publicSongURL = convertS3Url(songURL)
 const publicCoverURL = convertS3Url(coverArt)


    const client = await clientPromise;
    const db = client.db("music");

    const newSong: Song = {
      title: Title,
      artist: Artist,
      duration: Duration,
      songURL: publicSongURL,
      coverArt: publicCoverURL,
      uploadedAt: new Date(),
      liked: 0,
      playlist: []
    };

await db.collection("users").updateOne(
    { _id: Number(userId)},
  { $addToSet: { songs: newSong } },
    { upsert: true }
    );

    return NextResponse.json({ success: true, song: newSong});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

