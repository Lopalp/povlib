import { NextResponse } from 'next/server';
import { uploadAndParseDemo } from '@/lib/cloudRun/cloudRun';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await uploadAndParseDemo(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
