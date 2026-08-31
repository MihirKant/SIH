'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  FileText, 
  DollarSign, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  X, 
  Sparkles,
  Award,
  Layers,
  Wrench
} from 'lucide-react';
import { ChallengeItem, UniversityItem, NepCreditType } from '@/types';
import { useAuth } from '@/context/AuthContext';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeItem | null;
  university: UniversityItem;
  onProposalSubmitted: (newProject: any) => void;
}

// Factual Real Faculty Directory by University
const FACULTY_DIRECTORY: Record<string, { name: string; department: string; title: string }[]> = {
  'univ-1': [ // BIT Mesra
    { name: 'Dr. Bindhu Lal', department: 'Civil & Environmental Engg', title: 'Professor & Head' },
    { name: 'Dr. Kirti Avishek', department: 'Civil & Environmental Engg', title: 'Associate Professor' },
    { name: 'Dr. Abhijit Mustafi', department: 'Computer Science & Engg', title: 'Associate Professor & Head' },
    { name: 'Dr. Vandana Bhattacharjee', department: 'Computer Science & Engg', title: 'Professor' },
    { name: 'Dr. Kunal Mukhopadhyay', department: 'Bioengineering & Biotech', title: 'Professor & Head' },
    { name: 'Dr. Manish Kumar', department: 'Bioengineering & Biotech', title: 'Professor' },
  ],
  'univ-2': [ // NIT Jamshedpur
    { name: 'Prof. Danish Ali Khan', department: 'Computer Science & Engg', title: 'Professor & Head' },
    { name: 'Prof. Anil Kumar Choudhary', department: 'Civil Engineering', title: 'Professor' },
    { name: 'Dr. Sushil Kumar Gupta', department: 'Electrical Engineering', title: 'Associate Professor & Head' },
    { name: 'Prof. Satish Kumar', department: 'Mechanical Engineering', title: 'Professor' },
  ],
  'univ-3': [ // IIT ISM Dhanbad
    { name: 'Prof. Sukumar Laik', department: 'Mining & Environmental Hydrogeology', title: 'Senior Professor' },
    { name: 'Prof. Chiranjeev Kumar', department: 'Computer Science & Engg', title: 'Professor & Head' },
    { name: 'Dr. Gurdeep Singh', department: 'Environmental Hydrogeology', title: 'Professor' },
  ],
  'univ-4': [ // Ranchi University / BAU
    { name: 'Dr. C.S. Singh', department: 'Botany & Agriculture Extension', title: 'Professor' },
    { name: 'Dr. D.K. Shahi', department: 'Soil Science & Conservation', title: 'Dean & Senior Professor' },
    { name: 'Dr. Karma Oraon', department: 'Social Work & Tribal Dev', title: 'Professor' },
  ],
};

const NEP_CREDIT_OPTIONS: { type: NepCreditType; label: string; credits: number; description: string }[] = [
  { type: 'CAPSTONE', label: 'NEP Capstone Innovation Project', credits: 4, description: 'Final year multi-semester R&D project' },
  { type: 'INTERNSHIP', label: 'NEP Experiential Community Internship', credits: 3, description: 'Field research & community deployment' },
  { type: 'MULTIDISCIPLINARY_MINOR', label: 'NEP Multidisciplinary Minor Project', credits: 2, description: 'Cross-departmental collaborative credit' },
  { type: 'COMMUNITY_RD', label: 'NEP Social Impact Lab Credit', credits: 2, description: 'Lab prototyping & validation credit' },
];

export default function UniversityProposalModal({
  isOpen,
  onClose,
  challenge,
  university,
  onProposalSubmitted,
}: Props) {
  const { user } = useAuth();
  const facultyList = FACULTY_DIRECTORY[university.id] || FACULTY_DIRECTORY['univ-1'];

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [facultyMentor, setFacultyMentor] = useState(facultyList[0].name);
  const [teamName, setTeamName] = useState('');
  const [budgetRequired, setBudgetRequired] = useState<number>(250000);
  const [nepCreditType, setNepCreditType] = useState<NepCreditType>('CAPSTONE');
  const [billOfMaterials, setBillOfMaterials] = useState('');
  
  // Multidisciplinary student team builder
  const [students, setStudents] = useState<{ name: string; department: string; role: string }[]>([
    { name: 'Aarav Sharma', department: 'Computer Science & AI', role: 'Team Lead & IoT Architect' },
    { name: 'Priya Hansda', department: 'Civil & Environmental Engg', role: 'Field Researcher & Soil Analyst' },
  ]);

  // Initial milestone targets
  const [milestones, setMilestones] = useState<{ title: string; dueDate: string }[]>([
    { title: 'Lab Sample Analysis & Sensor Calibration', dueDate: '2026-09-15' },
    { title: 'Prototype Fabrication & Field Testing', dueDate: '2026-10-30' },
    { title: 'Community Deployment & Pilot Validation', dueDate: '2026-12-15' },
  ]);

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !challenge) return null;

  const handleAddStudent = () => {
    setStudents([...students, { name: '', department: university.departments[0] || 'Engineering', role: 'Research Associate' }]);
  };

  const handleRemoveStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const handleStudentChange = (index: number, field: string, value: string) => {
    const updated = [...students];
    (updated[index] as any)[field] = value;
    setStudents(updated);
  };

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: '', dueDate: '2026-10-15' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDescription) return;

    setSubmitting(true);
    try {
      const selectedNepObj = NEP_CREDIT_OPTIONS.find(n => n.type === nepCreditType);

      const payload = {
        title: projectTitle,
        description: projectDescription,
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        universityId: university.id,
        universityName: university.name,
        facultyMentorName: facultyMentor,
        teamName: teamName || `${university.code} Innovators`,
        teamMembers: students.map(s => s.name || 'Student Researcher'),
        studentRoles: students,
        nepCreditType,
        nepCreditsCount: selectedNepObj?.credits || 3,
        budgetRequired,
        billOfMaterials: billOfMaterials || 'Sensors, Bio-filter core, Solar Micro-controller',
        milestones: milestones.map((m, idx) => ({
          id: `m-${Date.now()}-${idx}`,
          title: m.title || `Milestone ${idx + 1}`,
          dueDate: m.dueDate,
          status: idx === 0 ? 'IN_PROGRESS' : 'PENDING',
        })),
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      // Update Firestore document if available
      try {
        const { db } = await import('@/firebase');
        const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
        const challengeRef = doc(db, 'challenges', challenge.id);
        await updateDoc(challengeRef, {
          status: 'In Development',
          isAdopted: true,
          adoptedBy: user?.uid || 'HEI Admin',
          adoptedAt: serverTimestamp(),
          assignedHEI: {
            name: university.name,
            heiName: university.name,
            facultyMentor,
            studentLead: students[0]?.name || 'Student Lead',
            teamName: teamName || `${university.code} Innovators`,
            budgetRequired: budgetRequired || 350000,
            solutionSummary: projectDescription || projectTitle,
            adoptedAt: serverTimestamp(),
          },
        });
      } catch (e) {
        console.warn('Firestore adoption update notice:', e);
      }

      if (json.success) {
        onProposalSubmitted(json.data);
        onClose();
      } else {
        onProposalSubmitted(payload);
        onClose();
      }
    } catch (err) {
      console.error('Proposal submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                R&D Solution Proposal Builder
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">NEP 2020</span>
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-lg">
                Institution: <strong className="text-slate-800">{university.name}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Challenge Context */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-1 text-xs">
          <span className="text-[10px] text-blue-800 font-extrabold uppercase tracking-wider">Target Challenge Ticket</span>
          <h4 className="font-bold text-slate-900 text-sm">{challenge.title}</h4>
          <p className="text-slate-600 line-clamp-2">{challenge.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Proposal Title & Description */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                R&D Project Proposal Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jal-Shuddhi: Solar Graphene Bio-Filter for Heavy Metal Water Purification"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Technical Architecture & Solution Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe your technical methodology, prototyping plan, hardware/software stack..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-medium leading-relaxed"
              />
            </div>
          </div>

          {/* Real Faculty Mentor Selection & NEP 2020 Credit Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Real Faculty Mentor Directory */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Assign Verified Faculty Mentor *</span>
              </label>
              <select
                value={facultyMentor}
                onChange={(e) => setFacultyMentor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-semibold cursor-pointer"
              >
                {facultyList.map(f => (
                  <option key={f.name} value={f.name} className="bg-white text-slate-900">
                    {f.name} ({f.title} - {f.department})
                  </option>
                ))}
              </select>
            </div>

            {/* NEP 2020 Experiential Credit Alignment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>NEP 2020 Academic Credit Track *</span>
              </label>
              <select
                value={nepCreditType}
                onChange={(e: any) => setNepCreditType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-semibold cursor-pointer"
              >
                {NEP_CREDIT_OPTIONS.map(opt => (
                  <option key={opt.type} value={opt.type} className="bg-white text-slate-900">
                    {opt.label} ({opt.credits} Credits)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multidisciplinary Team Builder */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Multidisciplinary Student Team Builder</span>
                </label>
                <p className="text-[10px] text-slate-500">Assemble cross-departmental students (e.g. CSE + Civil + Agritech).</p>
              </div>

              <button
                type="button"
                onClick={handleAddStudent}
                className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1 hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {students.map((st, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={st.name}
                    onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
                    className="flex-1 min-w-[130px] px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                  />
                  <select
                    value={st.department}
                    onChange={(e) => handleStudentChange(idx, 'department', e.target.value)}
                    className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
                  >
                    {university.departments.map(d => (
                      <option key={d} value={d} className="bg-white">{d}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Role (e.g. IoT Lead)"
                    value={st.role}
                    onChange={(e) => handleStudentChange(idx, 'role', e.target.value)}
                    className="flex-1 min-w-[120px] px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                  />
                  {students.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(idx)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Budget & Bill of Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-green-600" />
                <span>Estimated R&D Budget Required (₹)</span>
              </label>
              <input
                type="number"
                required
                step={10000}
                value={budgetRequired}
                onChange={(e) => setBudgetRequired(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-amber-600" />
                <span>Bill of Materials (BOM Hardware/Software)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Solar panel 50W, Graphene membrane, ESP32"
                value={billOfMaterials}
                onChange={(e) => setBillOfMaterials(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Milestones Schedule Setup */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-green-600" />
                <span>Project Milestone Schedule</span>
              </label>

              <button
                type="button"
                onClick={handleAddMilestone}
                className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
              >
                + Add Milestone
              </button>
            </div>

            <div className="space-y-2">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Milestone title"
                    value={m.title}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[idx].title = e.target.value;
                      setMilestones(updated);
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-medium"
                  />
                  <input
                    type="date"
                    required
                    value={m.dueDate}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[idx].dueDate = e.target.value;
                      setMilestones(updated);
                    }}
                    className="w-36 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting Proposal...' : 'Submit R&D Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
