import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function POST(req: Request){

  const { userId,index, fieldName} = await req.json(); // index is the song ID or index


  if (!userId || index === undefined) {
    return NextResponse.json({ error: "Missing userId or index" }, { status: 400 });
  }

  const client = await clientPromise
  const db =  client.db('music')

  await db.collection("users").updateOne(
    { _id: userId },
       { $addToSet: { [`fields.${fieldName}`]: index } }, // Nested under 'fields' 
    { upsert: true }
  );

const findResult = await db.collection('users').findOne({ _id: 1 });

return NextResponse.json({ success: true, updatedIndices: findResult});
}



export async function GET (req: Request){

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("music");


  
  const user = await db.collection("users").findOne(
    { _id: Number(userId) },
    { projection: { _id: 0, fields: 1 } } // only return `fields`
  );

    if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user.fields || {});

}
