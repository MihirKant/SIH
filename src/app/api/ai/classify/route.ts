import { NextResponse } from 'next/server';
import { classifyAndRouteChallenge } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { title, description, district } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description required' },
        { status: 400 }
      );
    }

    const aiResult = await classifyAndRouteChallenge(title, description, district || 'Ranchi');

    return NextResponse.json({
      success: true,
      analysis: aiResult,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'AI Classification error' },
      { status: 500 }
    );
  }
}
