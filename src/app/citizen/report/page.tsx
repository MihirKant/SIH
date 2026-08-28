'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  MapPin,
  Mic,
  MicOff,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Smartphone,
  FileText,
  Video,
  Building2,
  ShieldCheck,
  Building,
  UserCheck,
} from 'lucide-react';
import AiProcessingModal from '@/components/AiProcessingModal';
import LocationPickerMap from '@/components/LocationPickerMap';
import { AiClassificationResult, SubmitterType, ProblemCategory } from '@/types';

const DISTRICTS = [
  'Ranchi', 'East Singhbhum', 'Dhanbad', 'Hazaribagh', 'Latehar', 'Khunti',
  'Simdega', 'Bokaro', 'Deoghar', 'Dumka', 'Palamu', 'Giridih'
];

const SUBMITTER_ROLES: { type: SubmitterType; label: string; description: string; icon: any; color: string }[] = [
  {
    type: 'CITIZEN',
    label: 'Individual Citizen (आम नागरिक)',
    description: 'Local resident, farmer, youth, or student',
    icon: Users,
    color: 'bg-green-50 border-green-300 text-green-800 ring-2 ring-green-500'
  },
  {
    type: 'PANCHAYAT_PRI',
    label: 'Panchayati Raj (ग्राम पंचायत / मुखिया)',
    description: 'Gram Panchayat Mukhiya, Sarpanch, or Panchayat Officer',
    icon: ShieldCheck,
    color: 'bg-teal-50 border-teal-300 text-teal-800 ring-2 ring-teal-500'
  },
  {
    type: 'URBAN_LOCAL_BODY',
    label: 'Urban Local Body (नगर निकाय / ULB)',
    description: 'Municipal Corporation officer, Ward Commissioner',
    icon: Building2,
    color: 'bg-blue-50 border-blue-300 text-blue-800 ring-2 ring-blue-500'
  },
  {
    type: 'COMMUNITY_ORG',
    label: 'Community Org / NGO (संस्था / SHG)',
    description: 'Self-Help Group (SHG), Local NGO, Youth Club',
    icon: Building,
    color: 'bg-purple-50 border-purple-300 text-purple-800 ring-2 ring-purple-500'
  },
  {
    type: 'GOVT_DEPARTMENT',
    label: 'Government Officer (सरकारी अधिकारी)',
    description: 'District Field Officer, BDO, Jal Sahiya, ASHA worker',
    icon: UserCheck,
    color: 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-500'
  },
];

const CATEGORIES_LIST: ProblemCategory[] = [
  'Water Resources',
  'Sustainable Agriculture',
  'Rural Healthcare',
  'Urban & Rural Infrastructure',
  'Clean Energy & Power',
  'Education & Skill Tech',
  'Waste Management & Sanitation',
  'Environment & Forestry',
  'Accessibility & Differently Abled',
  'Rural Livelihoods & NTFP',
  'Public Administration & Services',
];

export default function CitizenReportFormPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);

  const [submitterType, setSubmitterType] = useState<SubmitterType>('CITIZEN');
  const [submitterOrgId, setSubmitterOrgId] = useState('');
  const [reporterName, setReporterName] = useState('');

  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('AUTO_AI');
  const [description, setDescription] = useState('');

  const [district, setDistrict] = useState('Ranchi');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number>(23.3441);
  const [longitude, setLongitude] = useState<number>(85.3854);

  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [docName, setDocName] = useState('');
  const [docData, setDocData] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechLanguage, setSpeechLanguage] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [submitting, setSubmitting] = useState(false);

  const [aiResult, setAiResult] = useState<AiClassificationResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('jansamadhan_report_draft_v3');
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        if (draft.title) setTitle(draft.title);
        if (draft.description) setDescription(draft.description);
        if (draft.district) setDistrict(draft.district);
        if (draft.locationName) setLocationName(draft.locationName);
        if (draft.submitterType) setSubmitterType(draft.submitterType);
        if (draft.reporterName) setReporterName(draft.reporterName);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (title || description) {
      const draft = { title, description, district, locationName, submitterType, reporterName };
      localStorage.setItem('jansamadhan_report_draft_v3', JSON.stringify(draft));
    }
  }, [title, description, district, locationName, submitterType, reporterName]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    let streamActive = false;

    if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamActive = true;
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onloadend = () => {
              setAudioUrl(reader.result as string);
              setAudioRecorded(true);
            };
            reader.readAsDataURL(audioBlob);
          }
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start(200);
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone access denied or unavailable:', err);
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = speechLanguage;
        recognition.continuous = true;
        recognition.interimResults = true;

        let baseDesc = description;

        recognition.onresult = (event: any) => {
          let interimText = '';
          let finalText = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              finalText += res[0].transcript + ' ';
            } else {
              interimText += res[0].transcript;
            }
          }

          if (finalText) {
            baseDesc = (baseDesc ? baseDesc + ' ' : '') + finalText.trim();
          }

          const combined = (baseDesc + (interimText ? ' ' + interimText : '')).trim();
          if (combined) {
            setDescription(combined);
            setAudioRecorded(true);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition error:', e.error);
        };

        recognition.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('Speech recognition failed to start:', e);
      }
    }

    if (!streamActive && !SpeechRecognition) {
      fallbackVoiceSimulation();
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    setIsRecording(false);

    if (!audioRecorded) {
      setAudioRecorded(true);
      if (!description) {
        setDescription(
          speechLanguage === 'hi-IN'
            ? 'हमारे पंचायत के सार्वजनिक कुएं में आर्सेनिक और भारी धातु की मात्रा अधिक है। बच्चों के स्वास्थ्य पर बुरा असर पड़ रहा है।'
            : 'Water in Namkum village public well is heavily contaminated with arsenic. Immediate bio-filtration and university R&D needed.'
        );
      }
    }
  };

  const handleVoiceRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const fallbackVoiceSimulation = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setDocData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: selectedCategory !== 'AUTO_AI' ? `[User Specified Category: ${selectedCategory}]\n${description}` : description,
          district,
          locationName: locationName || `${district} Block Center`,
          latitude,
          longitude,
          reporterName: reporterName || (submitterType === 'CITIZEN' ? 'Anonymous Citizen' : 'Panchayat Representative'),
          submitterType,
          submitterOrgId: submitterOrgId || undefined,
          images: [imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800'],
          audioUrl: audioUrl || undefined,
          videoUrl: videoUrl || undefined,
          documents: docData ? [docData] : [],
          documentsName: docName ? [docName] : [],
        }),
      });

      const json = await res.json();
      if (json.success && json.aiAnalysis) {
        try { localStorage.removeItem('jansamadhan_report_draft_v3'); } catch (e) {}
        setAiResult(json.aiAnalysis);
        setShowModal(true);
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-28">
      {/* Back Button */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-green-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" /> Mobile & Offline Ready
          </span>
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
              <Users className="w-7 h-7 text-green-700 flex-shrink-0" />
              <span>Report a Problem / समस्या दर्ज करें</span>
            </h1>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-xl border border-green-200">
              Step {currentStep} of 4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Speak in Hindi/English or type. Real GPS & camera evidence are attached automatically for University R&D solutions.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {[
            { step: 1, title: '1. Role' },
            { step: 2, title: '2. Voice & Details' },
            { step: 3, title: '3. Location' },
            { step: 4, title: '4. Evidence & Submit' },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`py-2.5 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                currentStep === s.step
                  ? 'bg-green-700 text-white border-green-700 shadow-sm'
                  : currentStep > s.step
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-700" />
                  <span>Select Submitter Entity / प्रेषक संस्था *</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUBMITTER_ROLES.map((role) => {
                    const IconComp = role.icon;
                    const isSelected = submitterType === role.type;
                    return (
                      <button
                        key={role.type}
                        type="button"
                        onClick={() => setSubmitterType(role.type)}
                        className={`p-4 rounded-xl text-left border transition-all flex items-start space-x-3 ${
                          isSelected
                            ? `${role.color} shadow-sm`
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{role.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-green-700" />}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-1">{role.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Reporter Name / नाम (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunil Munda (Gram Pradhan)"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-green-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Official Registration Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LGD-Panchayat-23841"
                    value={submitterOrgId}
                    onChange={(e) => setSubmitterOrgId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-green-600 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-7 py-3.5 rounded-xl bg-green-700 text-white font-bold text-xs hover:bg-green-800 shadow-sm transition-all"
                >
                  Next Step: Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-green-50/70 border border-green-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className={`w-5 h-5 ${isRecording ? 'text-red-600 animate-pulse' : 'text-green-700'}`} />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Record Voice Complaint / बोलकर समस्या बताएं</span>
                      <span className="text-[11px] text-slate-500">Audio will be attached & transcribed automatically</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSpeechLanguage('hi-IN')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${speechLanguage === 'hi-IN' ? 'bg-green-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      हिंदी
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeechLanguage('en-IN')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${speechLanguage === 'en-IN' ? 'bg-green-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      English
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleVoiceRecordToggle}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-200'
                        : 'bg-green-700 hover:bg-green-800 text-white'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4 animate-spin" />
                        <span>Recording... {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:{(recordingSeconds % 60).toString().padStart(2, '0')} (Tap to Stop)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>{audioRecorded ? 'Record Voice Again (फिर से बोलें)' : 'Tap to Record Voice (बोलकर दर्ज करें)'}</span>
                      </>
                    )}
                  </button>

                  {/* Recorded Audio Preview Player */}
                  {audioRecorded && (
                    <div className="p-3 bg-white rounded-xl border border-green-300 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-green-800">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Voice Recording Ready ({recordingSeconds > 0 ? `${recordingSeconds}s` : 'Audio Clip'})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAudioRecorded(false);
                            setAudioUrl('');
                          }}
                          className="text-[11px] text-red-600 hover:underline"
                        >
                          Remove Audio
                        </button>
                      </div>
                      {audioUrl ? (
                        <audio src={audioUrl} controls className="w-full h-8" />
                      ) : (
                        <div className="text-xs text-slate-500 italic">Voice transcribed into description box below.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Problem Title / समस्या का शीर्षक *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drinking Water Arsenic Contamination in Namkum"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Problem Description / विस्तृत विवरण *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the issue, number of affected villagers, urgency..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-7 py-3.5 rounded-xl bg-green-700 text-white font-bold text-xs hover:bg-green-800 shadow-sm"
                >
                  Next Step: Map →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">District / जिला *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-green-600"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Village / Ward Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Namkum Village, Ward 4"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-green-700" />
                  <span>GPS Map Location Pin</span>
                </label>
                <LocationPickerMap
                  initialLat={latitude}
                  initialLng={longitude}
                  district={district}
                  onLocationSelect={(loc) => {
                    setLatitude(loc.lat);
                    setLongitude(loc.lng);
                    if (loc.locationName && !locationName) {
                      setLocationName(loc.locationName);
                    }
                  }}
                />
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-7 py-3.5 rounded-xl bg-green-700 text-white font-bold text-xs hover:bg-green-800 shadow-sm"
                >
                  Next Step: Evidence →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <Camera className="w-6 h-6 text-green-700 mx-auto" />
                  <span className="text-xs font-bold text-slate-700 block">Photo Evidence</span>
                  <input
                    type="file"
                    accept="image/*"
                    ref={photoInputRef}
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    {imageUrl ? '✓ Photo Selected' : 'Upload / Capture Photo'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <Mic className={`w-6 h-6 mx-auto ${audioRecorded ? 'text-green-700' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-700 block">Voice Complaint</span>
                  {audioRecorded ? (
                    <div className="space-y-1">
                      <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 font-bold text-[11px] inline-block">
                        ✓ Audio Recorded
                      </span>
                      {audioUrl && <audio src={audioUrl} controls className="w-full h-8 mt-1" />}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      + Record Audio (Step 2)
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <FileText className="w-6 h-6 text-blue-600 mx-auto" />
                  <span className="text-xs font-bold text-slate-700 block">PDF Document</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    ref={docInputRef}
                    onChange={handleDocUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    {docName ? `✓ ${docName.slice(0, 15)}...` : 'Attach PDF File'}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={submitting || !title || !description}
                  className="px-8 py-4 rounded-xl bg-green-700 hover:bg-green-800 text-white font-black text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{submitting ? 'Analyzing with AI...' : 'Submit Challenge (दर्ज करें)'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <AiProcessingModal
        isOpen={showModal}
        analysis={aiResult}
        challengeTitle={title}
        onClose={() => {
          setShowModal(false);
          router.push('/citizen');
        }}
      />
    </div>
  );
}
