import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const client = await clientPromise;
  const db = client.db("music");
  
  const user = await db.collection("users").findOne(
    { _id: Number(userId) },
    { projection: { songs: 1, _id: 0 } } 
  );

  const songs = user?.songs || [];

  return NextResponse.json({ songs });
}

