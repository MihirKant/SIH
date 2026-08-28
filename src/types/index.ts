export type UserRole = 
  | 'CITIZEN' 
  | 'UNIVERSITY_FACULTY' 
  | 'UNIVERSITY_STUDENT' 
  | 'INDUSTRY_CSR' 
  | 'GOVT_ADMIN';

export type SubmitterType = 
  | 'CITIZEN'
  | 'PANCHAYAT_PRI'
  | 'URBAN_LOCAL_BODY'
  | 'COMMUNITY_ORG'
  | 'GOVT_DEPARTMENT';

export type ProblemCategory = 
  | 'Water Resources'
  | 'Sustainable Agriculture'
  | 'Rural Healthcare'
  | 'Urban & Rural Infrastructure'
  | 'Clean Energy & Power'
  | 'Education & Skill Tech'
  | 'Waste Management & Sanitation'
  | 'Environment & Forestry'
  | 'Accessibility & Differently Abled'
  | 'Rural Livelihoods & NTFP'
  | 'Public Administration & Services';

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  subCategory?: string;
  district: string;
  locationName: string;
  latitude: number;
  longitude: number;
  images: string[];
  audioUrl?: string;
  videoUrl?: string;
  documents?: string[];
  documentsName?: string[];
  status: 'OPEN' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLUSTERED';
  urgencyScore: number; // 1-100
  impactScore: number; // 1-100
  upvotesCount: number;
  reporterName?: string;
  submitterType?: SubmitterType;
  submitterOrgId?: string;
  clusterId?: string;
  assignedUniversityId?: string;
  assignedUniversityName?: string;
  createdAt: string;
}

export interface UniversityItem {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  type: string;
  departments: string[];
  facultyCount: number;
  studentCount: number;
  activeProjects: number;
}

export type NepCreditType = 
  | 'CAPSTONE'
  | 'INTERNSHIP'
  | 'MULTIDISCIPLINARY_MINOR'
  | 'COMMUNITY_RD';

export interface StudentRoleItem {
  name: string;
  department: string;
  role: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  challengeId: string;
  challengeTitle?: string;
  universityId: string;
  universityName?: string;
  facultyMentorName?: string;
  targetDepartment?: string;
  teamName: string;
  teamMembers: string[];
  studentRoles?: StudentRoleItem[];
  nepCreditType?: NepCreditType;
  nepCreditsCount?: number;
  billOfMaterials?: string;
  status: 'PROPOSED' | 'APPROVED' | 'PROTOTYPING' | 'PILOT_TESTING' | 'DEPLOYED' | 'PATENTED';
  budgetRequired: number;
  budgetFunded: number;
  patentStatus: 'NONE' | 'APPLIED' | 'GRANTED';
  milestones: MilestoneItem[];
  createdAt: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  deliverables?: string;
}

export interface GrantItem {
  id: string;
  projectId: string;
  projectTitle: string;
  sponsorName: string;
  amountPledged: number;
  status: 'COMMITTED' | 'DISBURSED';
  csrCategory: string;
  createdAt: string;
}

export interface AiClassificationResult {
  category: ProblemCategory;
  subCategory: string;
  urgencyScore: number;
  impactScore: number;
  reasoning: string;
  recommendedDepartments: string[];
  duplicateMatchFound: boolean;
  duplicateChallengeId?: string;
  matchedUniversityId?: string;
  matchedUniversityName?: string;
}
