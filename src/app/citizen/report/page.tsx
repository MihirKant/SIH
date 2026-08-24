'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  MapPin, 
  Mic, 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  Zap,
  Globe
} from 'lucide-react';
import AiProcessingModal from '@/components/AiProcessingModal';
import { AiClassificationResult } from '@/types';

const DISTRICTS = ['Ranchi', 'East Singhbhum', 'Dhanbad', 'Hazaribagh', 'Latehar', 'Khunti', 'Simdega', 'Bokaro'];

export default function CitizenReportFormPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('Ranchi');
  const [locationName, setLocationName] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [aiResult, setAiResult] = useState<AiClassificationResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleVoiceRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setAudioRecorded(true);
      if (!description) {
        setDescription('Hamare Namkum panchayat ke samne wale well ka paani bohot contaminated hai. Bachon ko pet ki bimari ho rahi hai. (Voice note transcribed from Santhali/Nagpuri audio)');
      }
    }, 2500);
  };

  const handleAutoGps = () => {
    setLocationName('Village Namkum Ward-4 (GPS: 23.3441° N, 85.3854° E)');
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
          description,
          district,
          locationName: locationName || `${district} Main Block`,
          reporterName: reporterName || 'Anonymous Citizen',
          images: [imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800'],
        }),
      });

      const json = await res.json();
      if (json.success && json.aiAnalysis) {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Back Button & Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> AI Auto-Classifier Enabled
        </span>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-emerald-400" />
            Report a Grassroots Societal Problem
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Submit water, agricultural, healthcare, or infrastructure issues. Voice notes and photos will be automatically transcribed and processed by Gemini AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title input */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Problem Title / Title of Challenge *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. High Arsenic & Lead in Namkum Village Handpumps"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-medium"
            />
          </div>

          {/* Multilingual Voice Recording Option */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                Multilingual Voice Input (Hindi / Santhali / Nagpuri / English)
              </span>
              {audioRecorded && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">Audio Attached</span>}
            </div>
            
            <p className="text-[11px] text-slate-400">
              Citizens can speak directly into the microphone. Our AI engine transcribes regional dialects to English text.
            </p>

            <button
              type="button"
              onClick={handleVoiceRecord}
              disabled={isRecording}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : audioRecorded
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? 'Listening to Voice Input...' : audioRecorded ? 'Re-record Voice Note' : 'Record Audio Note (2s Demo)'}</span>
            </button>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe what is happening, how many people are affected, and any specific hazards..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-medium leading-relaxed"
            />
          </div>

          {/* District & Geolocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                District (Jharkhand) *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
              >
                {DISTRICTS.map(d => (
                  <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Location / Village Name
                </label>
                <button
                  type="button"
                  onClick={handleAutoGps}
                  className="text-[10px] text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> Auto GPS
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. Bano Panchayat, Ward 3"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>
          </div>

          {/* Photo URL / Evidence Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Photo URL / Evidence Image
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Reporter Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sunil Munda (Gram Pradhan)"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>Gemini AI Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>Submit & Trigger AI Classifier</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* AI Execution Modal */}
      <AiProcessingModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          router.push('/citizen');
        }}
        analysis={aiResult}
        challengeTitle={title}
      />

    </div>
  );
}
