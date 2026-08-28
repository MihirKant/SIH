import { NextResponse } from 'next/server';
import { matchChallengeToUniversity } from '@/lib/universityMatcher';
import { INITIAL_UNIVERSITIES } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, subCategory, district, recommendedDepartments } = body;

    if (!category || !district) {
      return NextResponse.json(
        { success: false, error: 'Category and district are required.' },
        { status: 400 }
      );
    }

    const matchmakingResult = matchChallengeToUniversity(
      category,
      subCategory || '',
      district,
      recommendedDepartments || [],
      INITIAL_UNIVERSITIES
    );

    return NextResponse.json({
      success: true,
      data: matchmakingResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error executing university matchmaking.' },
      { status: 500 }
    );
  }
}
