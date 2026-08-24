import { NextResponse } from 'next/server';
import { INITIAL_CHALLENGES, INITIAL_PROJECTS, INITIAL_GRANTS, DISTRICT_STATS } from '@/lib/mockData';

export async function GET() {
  const totalChallenges = INITIAL_CHALLENGES.length + 184; // Add baseline regional stats
  const resolvedChallenges = 64;
  const activeProjects = INITIAL_PROJECTS.length + 42;
  const totalCsrFunded = '₹ 1.42 Crores';
  const patentsApplied = 12;
  const HEIsParticipating = 14;

  const categoryBreakdown = [
    { name: 'Water Resources', count: 54, percentage: 28 },
    { name: 'Sustainable Agri', count: 42, percentage: 22 },
    { name: 'Waste Mgmt & Sanitation', count: 36, percentage: 19 },
    { name: 'Rural Healthcare', count: 28, percentage: 15 },
    { name: 'Clean Energy', count: 18, percentage: 10 },
    { name: 'Education & Tech', count: 12, percentage: 6 },
  ];

  return NextResponse.json({
    success: true,
    data: {
      totalChallenges,
      resolvedChallenges,
      activeProjects,
      totalCsrFunded,
      patentsApplied,
      HEIsParticipating,
      categoryBreakdown,
      districtStats: DISTRICT_STATS,
    }
  });
}
