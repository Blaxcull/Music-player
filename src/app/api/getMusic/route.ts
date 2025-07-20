import { NextResponse } from 'next/server';

import fs from 'fs';
import path from 'path';
export const runtime = 'nodejs'








// get a map of the song names from the /public/music directory

export async function GET() {
  const musicDir = path.join(process.cwd(), 'public', 'music');
  const files = fs.readdirSync(musicDir);

  return NextResponse.json({ files });
}

