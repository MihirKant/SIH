import { NextResponse } from 'next/server';
import { INITIAL_PROJECTS } from '@/lib/mockData';
import { ProjectItem } from '@/types';

let projectsStore: ProjectItem[] = [...INITIAL_PROJECTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('universityId');
  const status = searchParams.get('status');

  let results = [...projectsStore];

  if (universityId && universityId !== 'ALL') {
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
    const { 
      title, 
      description, 
      challengeId, 
      challengeTitle, 
      universityId, 
      universityName, 
      teamName, 
      teamMembers, 
      studentRoles,
      facultyMentorName, 
      targetDepartment,
      nepCreditType,
      nepCreditsCount,
      billOfMaterials,
      budgetRequired,
      milestones 
    } = body;

    const newProject: ProjectItem = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      title,
      description,
      challengeId,
      challengeTitle: challengeTitle || 'Societal Problem Proposal',
      universityId: universityId || 'univ-1',
      universityName: universityName || 'BIT Mesra',
      facultyMentorName: facultyMentorName || 'Dr. Bindhu Lal (Professor & Head)',
      targetDepartment: targetDepartment || 'Engineering',
      teamName: teamName || 'Student Innovation Team',
      teamMembers: teamMembers || ['Aarav Sharma', 'Priya Hansda'],
      studentRoles: studentRoles || [],
      nepCreditType: nepCreditType || 'CAPSTONE',
      nepCreditsCount: nepCreditsCount || 4,
      billOfMaterials: billOfMaterials || 'Hardware components and IoT microcontrollers',
      status: 'PROPOSED',
      budgetRequired: budgetRequired || 250000,
      budgetFunded: 0,
      patentStatus: 'NONE',
      milestones: milestones && milestones.length > 0 ? milestones : [
        { id: `m-${Date.now()}-1`, title: 'Feasibility & Lab Simulation', dueDate: '2026-09-15', status: 'IN_PROGRESS' },
        { id: `m-${Date.now()}-2`, title: 'Prototype Fabrication', dueDate: '2026-10-10', status: 'PENDING' },
        { id: `m-${Date.now()}-3`, title: 'Field Pilot & Community Testing', dueDate: '2026-11-01', status: 'PENDING' }
      ],
      createdAt: new Date().toISOString(),
    };

    projectsStore.unshift(newProject);

    return NextResponse.json({ success: true, data: newProject });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { projectId, status, budgetFunded, patentStatus, milestoneId, milestoneStatus } = body;

    const projectIndex = projectsStore.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const updated = { ...projectsStore[projectIndex] };

    if (status) updated.status = status;
    if (budgetFunded !== undefined) updated.budgetFunded = budgetFunded;
    if (patentStatus) updated.patentStatus = patentStatus;

    if (milestoneId && milestoneStatus) {
      updated.milestones = updated.milestones.map(m => 
        m.id === milestoneId ? { ...m, status: milestoneStatus } : m
      );
    }

    projectsStore[projectIndex] = updated;

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
