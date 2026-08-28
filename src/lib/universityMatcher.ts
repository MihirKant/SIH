import { UniversityItem } from '@/types';
import { INITIAL_UNIVERSITIES } from './mockData';

export interface MatchmakingResult {
  matchedUniversityId: string;
  matchedUniversityName: string;
  confidenceScore: number; // 0-100%
  matchingDepartment: string;
  reasoning: string;
}

export function matchChallengeToUniversity(
  category: string,
  subCategory: string,
  district: string,
  recommendedDepts: string[] = [],
  universitiesList: UniversityItem[] = INITIAL_UNIVERSITIES
): MatchmakingResult {
  
  let bestUniversity: UniversityItem = universitiesList[0];
  let highestScore = -1;
  let bestMatchingDept = 'Research & Innovation Cell';

  for (const univ of universitiesList) {
    let score = 50; // Base score

    // 1. Geographical District Proximity Boost (+30 points)
    if (univ.district.toLowerCase() === district.toLowerCase()) {
      score += 30;
    }

    // 2. Department Discipline Match Boost (+40 points)
    let deptMatched = false;
    for (const univDept of univ.departments) {
      const deptLower = univDept.toLowerCase();
      
      // Check against AI recommended departments
      for (const recDept of recommendedDepts) {
        if (deptLower.includes(recDept.toLowerCase()) || recDept.toLowerCase().includes(deptLower)) {
          score += 40;
          deptMatched = true;
          bestMatchingDept = univDept;
          break;
        }
      }

      // Check category keywords
      if (!deptMatched) {
        if (
          (category.includes('Water') && (deptLower.includes('water') || deptLower.includes('environmental') || deptLower.includes('hydrogeology'))) ||
          (category.includes('Agriculture') && (deptLower.includes('botany') || deptLower.includes('agriculture') || deptLower.includes('robotics'))) ||
          (category.includes('Health') && (deptLower.includes('health') || deptLower.includes('biomedical') || deptLower.includes('biotech'))) ||
          (category.includes('Waste') && (deptLower.includes('chemical') || deptLower.includes('mining') || deptLower.includes('environmental'))) ||
          (category.includes('Energy') && (deptLower.includes('electrical') || deptLower.includes('renewable') || deptLower.includes('power'))) ||
          (category.includes('Livelihood') && (deptLower.includes('forestry') || deptLower.includes('rural') || deptLower.includes('social')))
        ) {
          score += 35;
          deptMatched = true;
          bestMatchingDept = univDept;
        }
      }
    }

    // 3. Institutional Type Boost (IIT/NIT/Deemed Univ research capability) (+15 points)
    if (univ.type.includes('National Importance') || univ.type.includes('Deemed')) {
      score += 15;
    }

    // 4. Workload Balancing Penalty (-1 point per active project)
    score -= Math.min(15, univ.activeProjects);

    if (score > highestScore) {
      highestScore = score;
      bestUniversity = univ;
    }
  }

  const confidenceScore = Math.min(98, Math.max(65, highestScore));

  return {
    matchedUniversityId: bestUniversity.id,
    matchedUniversityName: bestUniversity.name,
    confidenceScore,
    matchingDepartment: bestMatchingDept,
    reasoning: `Routed to ${bestUniversity.name} (${bestMatchingDept}) based on specialized faculty expertise, ${bestUniversity.district === district ? 'district proximity' : 'R&D center capability'}, and ${confidenceScore}% institutional alignment score.`,
  };
}
