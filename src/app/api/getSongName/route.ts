import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = 'nodejs'

export async function GET(req:Request){

    const {searchParams} = new URL(req.url) 
    const userId= searchParams.get("userID")
    const songUrl= searchParams.get("file")

    const client = await clientPromise

    const db = client.db("music");


 
  const user = await db.collection("users").findOne(
    { _id: Number(userId),
    "songs.songURL": songUrl},

    { projection: { songs: { $elemMatch: { songURL: songUrl } }, _id: 0 } }
  );


   const title = user?.songs?.[0]?.title || null;


  return NextResponse.json({title});
}
