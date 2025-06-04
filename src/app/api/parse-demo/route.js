import { NextResponse } from 'next/server';
import { uploadAndParseDemo } from '@/lib/cloudRun/cloudRun';
import Busboy from 'busboy';
import { Readable } from 'node:stream';

export const runtime = 'nodejs';

export async function POST(request) {
  return new Promise((resolve) => {
    const bb = Busboy({ headers: request.headers });
    const fields = {};
    let uploadPromise;

    bb.on('field', (name, val) => {
      fields[name] = val;
    });

    bb.on('file', (_name, file, info) => {
      const { filename } = info;
      uploadPromise = uploadAndParseDemo({
        ...fields,
        fileStream: file,
        fileName: filename
      });
    });

    bb.on('finish', async () => {
      try {
        const result = await uploadPromise;
        resolve(NextResponse.json(result));
      } catch (error) {
        resolve(
          NextResponse.json({ error: error.message }, { status: 500 })
        );
      }
    });

    Readable.fromWeb(request.body).pipe(bb);
  });
}
