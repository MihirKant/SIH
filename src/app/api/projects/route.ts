import { NextResponse } from 'next/server';
import { INITIAL_PROJECTS } from '@/lib/mockData';
import { ProjectItem } from '@/types';

let projectsStore: ProjectItem[] = [...INITIAL_PROJECTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('universityId');
  const status = searchParams.get('status');

  let results = [...projectsStore];

  if (universityId) {
    results = results.filter(p => p.universityId === universityId);
  }
  if (status && status !== 'ALL') {
    results = results.filter(p => p.status === status);
  }

  return NextResponse.json({ success: true, count: results.length, data: results });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, challengeId, challengeTitle, universityId, universityName, teamName, teamMembers, facultyMentorName, budgetRequired } = body;

    const newProject: ProjectItem = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      title,
      description,
      challengeId,
      challengeTitle: challengeTitle || 'Societal Problem Proposal',
      universityId: universityId || 'univ-1',
      universityName: universityName || 'BIT Mesra',
      facultyMentorName: facultyMentorName || 'Faculty Mentor',
      teamName: teamName || 'Student Innovation Team',
      teamMembers: teamMembers || ['Lead Researcher', 'Co-Developer'],
      status: 'PROPOSED',
      budgetRequired: budgetRequired || 250000,
      budgetFunded: 0,
      patentStatus: 'NONE',
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Feasibility & Lab Simulation', description: 'Simulate engineering models and chemical kinetics', dueDate: '2026-09-15', status: 'PENDING' },
        { id: `m-${Date.now()}-2`, title: 'Prototype Fabrication', description: 'Assemble hardware components and microcontrollers', dueDate: '2026-10-10', status: 'PENDING' },
        { id: `m-${Date.now()}-3`, title: 'Field Pilot & Community Testing', description: 'Deploy pilot unit in target village district', dueDate: '2026-11-01', status: 'PENDING' }
      ],
      createdAt: new Date().toISOString(),
    };

    projectsStore.unshift(newProject);

    return NextResponse.json({ success: true, data: newProject });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
