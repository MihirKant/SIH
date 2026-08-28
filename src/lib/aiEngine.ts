import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProblemCategory, AiClassificationResult } from '@/types';

// Supported Providers: 'GROQ_LLAMA3' | 'GEMINI_FLASH' | 'LOCAL_OLLAMA' | 'ZERO_TOKEN_LOCAL'
export type AiProvider = 'GROQ_LLAMA3' | 'GEMINI_FLASH' | 'LOCAL_OLLAMA' | 'ZERO_TOKEN_LOCAL';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_KEY = process.env.GROQ_API_KEY || '';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

export async function processAiClassification(
  title: string,
  description: string,
  district: string,
  preferredProvider?: AiProvider
): Promise<AiClassificationResult & { providerUsed: string }> {
  
  // 1. Try Groq Llama 3 API if key is present or requested
  if ((preferredProvider === 'GROQ_LLAMA3' || !preferredProvider) && GROQ_KEY) {
    try {
      const groqResult = await callGroqLlama3(title, description, district);
      if (groqResult) {
        return { duplicateMatchFound: false, ...groqResult, providerUsed: 'Groq Llama-3.1-8B (Free API)' };
      }
    } catch (e) {
      console.warn('Groq Llama 3 API call failed, falling back to next provider:', e);
    }
  }

  // 2. Try Gemini Flash if key is present
  if ((preferredProvider === 'GEMINI_FLASH' || !preferredProvider) && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = buildClassificationPrompt(title, description, district);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = parseAiJsonResponse(text);
      if (parsed) {
        return { duplicateMatchFound: false, ...parsed, providerUsed: 'Google Gemini Flash (Free Tier)' };
      }
    } catch (e) {
      console.warn('Gemini Flash API call failed, falling back to local engine:', e);
    }
  }

  // 3. Try Local Ollama if active
  if (preferredProvider === 'LOCAL_OLLAMA') {
    try {
      const ollamaResult = await callLocalOllama(title, description, district);
      if (ollamaResult) {
        return { duplicateMatchFound: false, ...ollamaResult, providerUsed: 'Local Ollama Llama 3 (0 Tokens)' };
      }
    } catch (e) {
      console.warn('Local Ollama call failed:', e);
    }
  }

  // 4. Zero-Token Local Vector & Heuristic Engine (100% Free & Offline)
  const localResult = runZeroTokenLocalClassification(title, description, district);
  return { 
    duplicateMatchFound: false,
    ...localResult, 
    providerUsed: 'Zero-Token Local Vector Engine (Offline)' 
  };
}

function buildClassificationPrompt(title: string, description: string, district: string): string {
  return `
You are an expert AI Societal Challenge Classifier and University Matchmaker for Smart India Hackathon.
Analyze the following citizen report from district "${district}", Jharkhand, India:

Title: "${title}"
Description: "${description}"

Available Categories (MUST select exact string):
- "Water Resources"
- "Sustainable Agriculture"
- "Rural Healthcare"
- "Urban & Rural Infrastructure"
- "Clean Energy & Power"
- "Education & Skill Tech"
- "Waste Management & Sanitation"
- "Environment & Forestry"
- "Accessibility & Differently Abled"
- "Rural Livelihoods & NTFP"
- "Public Administration & Services"

Return ONLY a raw JSON object with NO markdown wrapping:
{
  "category": "<exact category string>",
  "subCategory": "<short 3-5 word technical sub-domain>",
  "urgencyScore": <number 1-100 threat score>,
  "impactScore": <number 1-100 affected population score>,
  "reasoning": "<2 sentence explanation>",
  "recommendedDepartments": ["<dept 1>", "<dept 2>"]
}
`;
}

async function callGroqLlama3(title: string, description: string, district: string) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You output only valid JSON.' },
        { role: 'user', content: buildClassificationPrompt(title, description, district) }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  if (data.choices?.[0]?.message?.content) {
    return parseAiJsonResponse(data.choices[0].message.content);
  }
  return null;
}

async function callLocalOllama(title: string, description: string, district: string) {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt: buildClassificationPrompt(title, description, district),
      stream: false,
      format: 'json'
    })
  });
  const data = await response.json();
  if (data.response) {
    return parseAiJsonResponse(data.response);
  }
  return null;
}

function parseAiJsonResponse(text: string): any {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  return null;
}

// 100% Free & Zero-Token Fallback Classifier
export function runZeroTokenLocalClassification(
  title: string,
  description: string,
  district: string
) {
  const fullText = (title + ' ' + description).toLowerCase();

  let category: ProblemCategory = 'Urban & Rural Infrastructure';
  let subCategory = 'Public Utility Repair & Civil Works';
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
  } else if (fullText.includes('wheelchair') || fullText.includes('ramp') || fullText.includes('disabled') || fullText.includes('accessibility') || fullText.includes('blind') || fullText.includes('deaf')) {
    category = 'Accessibility & Differently Abled';
    subCategory = 'Assistive Tech & Universal Accessibility';
    urgencyScore = 88;
    impactScore = 80;
    recommendedDepartments = ['Mechanical & Assistive Design', 'Computer Science', 'Biomedical Engineering'];
  } else if (fullText.includes('forest') || fullText.includes('mahua') || fullText.includes('lac') || fullText.includes('tribal') || fullText.includes('handicraft') || fullText.includes('weaver')) {
    category = 'Rural Livelihoods & NTFP';
    subCategory = 'Non-Timber Forest Produce & Artisanal Tech';
    urgencyScore = 80;
    impactScore = 89;
    recommendedDepartments = ['Forestry & Rural Development', 'Industrial Design', 'Management Studies'];
  } else if (fullText.includes('tree') || fullText.includes('deforestation') || fullText.includes('pollution') || fullText.includes('air') || fullText.includes('biodiversity') || fullText.includes('riverbed')) {
    category = 'Environment & Forestry';
    subCategory = 'Ecological Conservation & Air Quality';
    urgencyScore = 86;
    impactScore = 87;
    recommendedDepartments = ['Environmental Science', 'Chemical Engineering', 'Forestry'];
  } else if (fullText.includes('pension') || fullText.includes('ration') || fullText.includes('certificate') || fullText.includes('panchayat') || fullText.includes('schemes') || fullText.includes('bureaucracy')) {
    category = 'Public Administration & Services';
    subCategory = 'Public Service Delivery & E-Gov Workflow';
    urgencyScore = 75;
    impactScore = 90;
    recommendedDepartments = ['Public Administration', 'Information Technology', 'Social Work'];
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

  const reasoning = `Zero-token heuristic analysis identified primary domain keywords for "${category}" in ${district} district. Priority urgency set to ${urgencyScore}/100.`;

  return {
    category,
    subCategory,
    urgencyScore,
    impactScore,
    reasoning,
    recommendedDepartments,
  };
}
