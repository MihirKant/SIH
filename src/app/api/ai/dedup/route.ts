import { NextResponse } from 'next/server';
import { findDuplicateAndCluster } from '@/lib/dedupEngine';
import { INITIAL_CHALLENGES } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, district, category } = body;

    if (!title || !description || !district) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and district are required.' },
        { status: 400 }
      );
    }

    const dedupResult = findDuplicateAndCluster(
      title,
      description,
      district,
      category || 'Water Resources',
      INITIAL_CHALLENGES
    );

    return NextResponse.json({
      success: true,
      data: dedupResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error executing deduplication check.' },
      { status: 500 }
    );
  }
}
