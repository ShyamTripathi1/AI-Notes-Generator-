import { NextResponse } from 'next/server';
import { generateNotes } from '@/lib/engine';

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.topic || body.topic.trim() === '') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const notesJson = await generateNotes(body);
    return NextResponse.json(notesJson, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating notes' },
      { status: 500 }
    );
  }
}
