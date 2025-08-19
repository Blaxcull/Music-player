import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("music");
  console.log(userId)

  const userDoc = await db.collection("users").findOne(
    { _id: Number(userId)},
    { projection: { fields: 1, _id: 0 } }   );

  const playlistIds = userDoc?.fields ? Object.keys(userDoc.fields) : [];
  console.log(userDoc)

  return NextResponse.json({ success: true, playlists: playlistIds });
}

