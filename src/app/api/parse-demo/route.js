import { NextResponse } from 'next/server';
import { parseDemoWithCloudRun } from '@/lib/cloudRunClient';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join(os.tmpdir(), file.name);
    await fs.writeFile(tempPath, buffer);

    try {
      const result = await parseDemoWithCloudRun(tempPath);
      return NextResponse.json(result);
    } finally {
      fs.unlink(tempPath).catch(() => {});
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
