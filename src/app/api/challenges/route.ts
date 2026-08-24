import { NextResponse } from 'next/server';
import { INITIAL_CHALLENGES } from '@/lib/mockData';
import { classifyAndRouteChallenge } from '@/lib/gemini';
import { ChallengeItem } from '@/types';

// In-memory state synchronized with mock data for instant demo responsiveness
let challengesStore: ChallengeItem[] = [...INITIAL_CHALLENGES];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const category = searchParams.get('category');
  const status = searchParams.get('status');

  let results = [...challengesStore];

  if (district && district !== 'ALL') {
    results = results.filter(c => c.district.toLowerCase() === district.toLowerCase());
  }
  if (category && category !== 'ALL') {
    results = results.filter(c => c.category === category);
  }
  if (status && status !== 'ALL') {
    results = results.filter(c => c.status === status);
  }

  return NextResponse.json({ success: true, count: results.length, data: results });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, district, locationName, latitude, longitude, reporterName, images, audioUrl } = body;

    if (!title || !description || !district) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and district are required.' },
        { status: 400 }
      );
    }

    // Run AI Classification, Urgency Scoring, Deduplication, and University Matchmaking
    const aiResult = await classifyAndRouteChallenge(title, description, district);

    const newChallenge: ChallengeItem = {
      id: `ch-${Date.now().toString().slice(-4)}`,
      title,
      description,
      category: aiResult.category,
      subCategory: aiResult.subCategory,
      district,
      locationName: locationName || `${district} Town Center`,
      latitude: latitude || 23.3441,
      longitude: longitude || 85.3854,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800'],
      audioUrl: audioUrl || undefined,
      status: aiResult.duplicateMatchFound ? 'CLUSTERED' : 'OPEN',
      urgencyScore: aiResult.urgencyScore,
      impactScore: aiResult.impactScore,
      upvotesCount: 1,
      reporterName: reporterName || 'Anonymous Citizen',
      assignedUniversityId: aiResult.matchedUniversityId,
      assignedUniversityName: aiResult.matchedUniversityName,
      createdAt: new Date().toISOString(),
    };

    challengesStore.unshift(newChallenge);

    return NextResponse.json({
      success: true,
      data: newChallenge,
      aiAnalysis: aiResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error processing report.' },
      { status: 500 }
    );
  }
}
