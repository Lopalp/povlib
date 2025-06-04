import { NextResponse } from 'next/server';
import { parseDemoFromGCSUri } from '@/lib/cloudRunClient';

export async function POST(request) {
  try {
    const { gcsUri } = await request.json();
    if (!gcsUri) {
      return NextResponse.json({ error: 'gcsUri required' }, { status: 400 });
    }
    const result = await parseDemoFromGCSUri(gcsUri);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
