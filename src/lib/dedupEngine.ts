import { ChallengeItem } from '@/types';

export interface DedupCheckResult {
  duplicateMatchFound: boolean;
  duplicateChallengeId?: string;
  clusterId?: string;
  clusterTitle?: string;
  similarityScore: number; // 0 to 100%
  reasoning: string;
}

// Compute Cosine & Jaccard Similarity between two text strings
export function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = tokenizeText(text1);
  const words2 = tokenizeText(text2);

  if (words1.length === 0 || words2.length === 0) return 0;

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  // Intersection
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  // Union
  const union = new Set([...set1, ...set2]);

  // Jaccard similarity coefficient
  const jaccard = intersection.size / union.size;

  // Cosine term frequency similarity boost
  let tfOverlapCount = 0;
  for (const w of intersection) {
    if (w.length > 3) tfOverlapCount += 2; // Weight key domain terms higher
    else tfOverlapCount += 1;
  }
  const cosineTermScore = Math.min(1.0, tfOverlapCount / Math.max(words1.length, words2.length, 1));

  const combinedScore = (jaccard * 0.4 + cosineTermScore * 0.6) * 100;
  return Math.min(100, Math.round(combinedScore));
}

function tokenizeText(text: string): string[] {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of', 'with', 'by', 'from',
    'this', 'that', 'there', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does',
    'did', 'very', 'local', 'area', 'problem', 'issue', 'need', 'require', 'urgent', 'please', 'report',
    'हाम्रा', 'का', 'के', 'की', 'और', 'में', 'पर', 'से', 'को', 'है', 'हैं'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

// Main Deduplication & Master Cluster Check Routine
export function findDuplicateAndCluster(
  title: string,
  description: string,
  district: string,
  category: string,
  existingChallenges: ChallengeItem[]
): DedupCheckResult {
  const newReportText = `${title} ${description}`;
  
  // Filter existing challenges in same district or category
  const relevantChallenges = existingChallenges.filter(
    c => c.district.toLowerCase() === district.toLowerCase() || c.category === category
  );

  let bestMatch: ChallengeItem | null = null;
  let highestSimilarity = 0;

  for (const challenge of relevantChallenges) {
    const existingText = `${challenge.title} ${challenge.description}`;
    const score = calculateTextSimilarity(newReportText, existingText);

    if (score > highestSimilarity) {
      highestSimilarity = score;
      bestMatch = challenge;
    }
  }

  // Threshold > 65% triggers deduplication & cluster grouping
  if (bestMatch && highestSimilarity >= 65) {
    const clusterId = bestMatch.clusterId || `cluster-${district.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    return {
      duplicateMatchFound: true,
      duplicateChallengeId: bestMatch.id,
      clusterId,
      clusterTitle: `Master Ticket Cluster: ${bestMatch.title}`,
      similarityScore: highestSimilarity,
      reasoning: `Found ${highestSimilarity}% semantic similarity with report #${bestMatch.id} ("${bestMatch.title}") in ${district}. Linked to Master Cluster #${clusterId}.`,
    };
  }

  return {
    duplicateMatchFound: false,
    similarityScore: highestSimilarity,
    reasoning: `No duplicate tickets found in ${district} (highest overlap: ${highestSimilarity}%). Created new standalone challenge ticket.`,
  };
}
