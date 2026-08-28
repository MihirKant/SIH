import { AiClassificationResult } from '@/types';
import { processAiClassification, AiProvider } from './aiEngine';
import { findDuplicateAndCluster } from './dedupEngine';
import { matchChallengeToUniversity } from './universityMatcher';
import { INITIAL_CHALLENGES, INITIAL_UNIVERSITIES } from './mockData';

export async function classifyAndRouteChallenge(
  title: string,
  description: string,
  district: string,
  provider?: AiProvider
): Promise<AiClassificationResult> {
  // 1. Run AI classification (via Groq Llama 3, Gemini Flash, or Zero-Token Vector Engine)
  const classification = await processAiClassification(title, description, district, provider);

  // 2. Run Semantic Deduplication & Master Ticket Clustering
  const dedup = findDuplicateAndCluster(
    title,
    description,
    district,
    classification.category,
    INITIAL_CHALLENGES
  );

  // 3. Run Multi-Factor HEI University Matchmaking
  const matchmaking = matchChallengeToUniversity(
    classification.category,
    classification.subCategory,
    district,
    classification.recommendedDepartments,
    INITIAL_UNIVERSITIES
  );

  return {
    category: classification.category,
    subCategory: classification.subCategory,
    urgencyScore: classification.urgencyScore,
    impactScore: classification.impactScore,
    reasoning: classification.reasoning,
    recommendedDepartments: classification.recommendedDepartments,
    duplicateMatchFound: dedup.duplicateMatchFound,
    duplicateChallengeId: dedup.duplicateChallengeId,
    matchedUniversityId: matchmaking.matchedUniversityId,
    matchedUniversityName: matchmaking.matchedUniversityName,
  };
}
