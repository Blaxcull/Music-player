import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { userId, index, symbol} = await req.json(); // index is the song ID or index


  if (!userId || index === undefined) {
    return NextResponse.json({ error: "Missing userId or index" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db("music"); 
      const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
  if (symbol=='+'){
      console.log('add')

  await db.collection("users").updateOne(
    { _id: userId },
    { $addToSet: { likedSongIds: index} }, // avoids duplicates
    { upsert: true }
  );

  }

  else if (symbol =='-'){

      console.log('remove')
   await db.collection("users").updateOne(
        { _id: userId },
        { $pull: { likedSongIds: index } }

   )

  }

const findResult = await db.collection('users').findOne({ _id: 1 });

return NextResponse.json({ success: true, updatedIndices: findResult});
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("music");

const user = await db.collection<{ _id: number; likedSongIds: number[] }>("users")
  .findOne({ _id: Number(userId) });

  return NextResponse.json({
    likedSongIds: user?.likedSongIds || [],
  });
}

