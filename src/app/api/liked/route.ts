import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { userId, file, symbol} = await req.json(); // index is the song ID or index


  if (!userId === undefined) {
    return NextResponse.json({ error: "Missing userId or index" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db("music"); 
  if (symbol=='+'){
      console.log('add')

await db.collection("users").findOneAndUpdate(
     
    { _id: Number(userId),
    "songs.songURL": file},
    {$set:{"songs.$.liked": 1}}

  );

  const updatedUser = await db.collection("users").findOne(
    { _id: Number(userId),
    "songs.songURL": file},
    { projection: { songs: { $elemMatch: { songURL: file} }, _id: 0 } }

  );

   const liked= updatedUser?.songs?.[0]?.liked?? null;

return NextResponse.json({ success: true, liked});

  }

  else if (symbol =='-'){

      console.log('remove')

await db.collection("users").findOneAndUpdate(

    { _id: Number(userId),
    "songs.songURL": file},
    {$set:{"songs.$.liked": 0}},


   )

  const updatedUser = await db.collection("users").findOne(
    { _id: Number(userId),
    "songs.songURL": file},
    { projection: { songs: { $elemMatch: { songURL: file} }, _id: 0 } }

  );

   const liked= updatedUser?.songs?.[0]?.liked?? null;

return NextResponse.json({ success: true, liked});

  }

}



export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const file = searchParams.get("file");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("music");

  const user = await db.collection("users").findOne(
    { _id: Number(userId),
    "songs.songURL": file},
    { projection: { songs: { $elemMatch: { songURL: file} }, _id: 0 } }


  )

   const liked= user?.songs?.[0]?.liked?? null;

  return NextResponse.json({liked});

}

