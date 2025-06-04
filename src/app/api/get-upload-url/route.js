import { NextResponse } from 'next/server';
import { getSignedUploadUrl } from '@/lib/cloudRunClient';

export async function POST(request) {
  try {
    const { fileName } = await request.json();
    if (!fileName) {
      return NextResponse.json({ error: 'fileName required' }, { status: 400 });
    }
    const result = await getSignedUploadUrl(fileName);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
