import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProblemCategory, AiClassificationResult } from '@/types';
import { INITIAL_UNIVERSITIES, INITIAL_CHALLENGES } from './mockData';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function classifyAndRouteChallenge(
  title: string,
  description: string,
  district: string
): Promise<AiClassificationResult> {
  // If Gemini API key is available, use live Gemini 1.5/2.0 Flash model
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an expert AI Societal Challenge Classifier and University Matchmaker for Smart India Hackathon.
Analyze the following citizen report from district "${district}" in India:

Title: "${title}"
Description: "${description}"

Categories available:
- "Water Resources"
- "Sustainable Agriculture"
- "Rural Healthcare"
- "Urban & Rural Infrastructure"
- "Clean Energy & Power"
- "Education & Skill Tech"
- "Waste Management & Sanitation"
- "E-Governance & Public Service"

Task:
Return a strictly formatted JSON object:
{
  "category": "<one of the exact categories above>",
  "subCategory": "<short 3-5 word technical domain>",
  "urgencyScore": <number 1-100 based on threat to health/life/livelihoods>,
  "impactScore": <number 1-100 based on population affected>,
  "reasoning": "<2 sentence explanation of urgency and category>",
  "recommendedDepartments": ["<dept 1>", "<dept 2>"]
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Deduplication & University matching
        const dedupResult = checkDeduplicationAndMatch(title, description, district, parsed.category);
        return {
          ...parsed,
          ...dedupResult
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local AI engine:', err);
    }
  }

  // Smart Heuristic Engine (Fallback when API key not configured)
  return fallbackAiClassification(title, description, district);
}

function checkDeduplicationAndMatch(
  title: string,
  description: string,
  district: string,
  category: string
) {
  // Check semantic overlap with existing challenges in same district/category
  const textLower = (title + ' ' + description).toLowerCase();
  const existingInDistrict = INITIAL_CHALLENGES.filter(
    c => c.district.toLowerCase() === district.toLowerCase() || c.category === category
  );

  let duplicateMatchFound = false;
  let duplicateChallengeId: string | undefined = undefined;

  for (const item of existingInDistrict) {
    const itemWords = (item.title + ' ' + item.description).toLowerCase().split(/\s+/);
    const textWords = textLower.split(/\s+/);
    const commonWords = textWords.filter(w => w.length > 3 && itemWords.includes(w));
    if (commonWords.length >= 4) {
      duplicateMatchFound = true;
      duplicateChallengeId = item.id;
      break;
    }
  }

  // Find best matching university in Jharkhand based on department and district
  const matchedUniv = INITIAL_UNIVERSITIES.find(u => 
    u.district.toLowerCase() === district.toLowerCase()
  ) || INITIAL_UNIVERSITIES[0];

  return {
    duplicateMatchFound,
    duplicateChallengeId,
    matchedUniversityId: matchedUniv.id,
    matchedUniversityName: matchedUniv.name,
  };
}

function fallbackAiClassification(
  title: string,
  description: string,
  district: string
): AiClassificationResult {
  const fullText = (title + ' ' + description).toLowerCase();

  let category: ProblemCategory = 'Urban & Rural Infrastructure';
  let subCategory = 'Public Utility Repair';
  let urgencyScore = 65;
  let impactScore = 70;
  let recommendedDepartments = ['Civil Engineering', 'Public Administration'];

  if (fullText.includes('water') || fullText.includes('arsenic') || fullText.includes('lead') || fullText.includes('well') || fullText.includes('pump') || fullText.includes('river')) {
    category = 'Water Resources';
    subCategory = 'Water Purification & Hydrogeology';
    urgencyScore = 90;
    impactScore = 88;
    recommendedDepartments = ['Environmental Engineering', 'Water Resource Mgmt', 'Hydrogeology'];
  } else if (fullText.includes('crop') || fullText.includes('paddy') || fullText.includes('farmer') || fullText.includes('soil') || fullText.includes('elephant') || fullText.includes('harvest')) {
    category = 'Sustainable Agriculture';
    subCategory = 'Agritech & Post-Harvest Protection';
    urgencyScore = 85;
    impactScore = 92;
    recommendedDepartments = ['Botany & Agriculture Extension', 'Robotics & IoT', 'Biological Science'];
  } else if (fullText.includes('health') || fullText.includes('vaccine') || fullText.includes('phc') || fullText.includes('hospital') || fullText.includes('doctor')) {
    category = 'Rural Healthcare';
    subCategory = 'Medical Logistics & Telemedicine';
    urgencyScore = 95;
    impactScore = 94;
    recommendedDepartments = ['Public Health', 'Biomedical Engineering', 'Renewable Energy'];
  } else if (fullText.includes('waste') || fullText.includes('plastic') || fullText.includes('coal') || fullText.includes('mine') || fullText.includes('garbage')) {
    category = 'Waste Management & Sanitation';
    subCategory = 'Environmental Remediation';
    urgencyScore = 88;
    impactScore = 86;
    recommendedDepartments = ['Chemical Engineering', 'Environmental Science', 'Materials Engg'];
  } else if (fullText.includes('power') || fullText.includes('solar') || fullText.includes('electricity') || fullText.includes('grid')) {
    category = 'Clean Energy & Power';
    subCategory = 'Solar Microgrid & Energy Storage';
    urgencyScore = 82;
    impactScore = 85;
    recommendedDepartments = ['Electrical & Smart Grid', 'Renewable Energy'];
  }

  const reasoning = `Extracted key domain triggers for "${category}". Assessed high community impact score (${impactScore}/100) and assigned priority routing tags.`;

  const dedup = checkDeduplicationAndMatch(title, description, district, category);

  return {
    category,
    subCategory,
    urgencyScore,
    impactScore,
    reasoning,
    recommendedDepartments,
    ...dedup
  };
}
