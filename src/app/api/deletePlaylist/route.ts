import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, fieldName} = await req.json();

  if (!userId ||  fieldName=== undefined) {
    return NextResponse.json(
      { error: "Missing userId or playlistId" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("music");

  const updateResult = await db.collection("users").updateOne(
    { _id: userId },
    { $unset: { [`fields.${fieldName}`]: "" } } // 👈 remove this playlist
  );

  if (updateResult.modifiedCount === 0) {
    return NextResponse.json(
      { error: "Playlist not found or already deleted" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Playlist ${fieldName} deleted for user ${userId}`,
  });
}

