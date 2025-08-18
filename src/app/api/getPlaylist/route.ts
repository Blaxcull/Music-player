import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request){

  const {userId, playlistId} = await req.json(); // index is the song ID or index


  if (!userId || playlistId=== undefined) {
    return NextResponse.json({ error: "Missing userId or index" }, { status: 400 });
  }

  const client = await clientPromise
  const db =  client.db('music')


const findResult = await db.collection("users").findOne(
  { _id: userId },                          // 1
  { projection: { [`fields.${playlistId}`]: 1, _id: 0 } }  // 2
);
const playlistArray = findResult?.fields?.[playlistId] || [];

return NextResponse.json({ success: true, playlistIndices: playlistArray });
}

