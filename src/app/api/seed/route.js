import { seedDatabase } from '/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed database', message: error.message },
      { status: 500 }
    );
  }
}