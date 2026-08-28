'use client';

/**
 * src/app/citizen/submit-problem/page.tsx
 * ----------------------------------------------------------
 * Citizen Problem Submission Module
 *
 * Form fields:
 *   - Title + Description
 *   - Domain Category dropdown
 *   - Jharkhand District dropdown
 *   - GPS Auto-Detect button
 *   - Photo upload with image preview
 *
 * On submit → writes to Firestore `challenges` collection
 * → Shows tracking ID confirmation modal
 * → Redirects back to /citizen/dashboard
 * ----------------------------------------------------------
 */

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute, RoleRoute } from '@/components/ProtectedRoute';
import {
  ArrowLeft,
  PlusCircle,
  MapPin,
  Navigation,
  Upload,
  X,
  CheckCircle2,
  Loader2,
  FileText,
  Tag,
  Image as ImageIcon,
  Copy,
  Home,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────

const DOMAINS = [
  'Education',
  'Healthcare',
  'Agriculture',
  'Water Resources',
  'Environment',
  'Energy',
  'Urban Development',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods',
];

const JHARKHAND_DISTRICTS = [
  'Ranchi',
  'Dhanbad',
  'East Singhbhum',
  'West Singhbhum',
  'Hazaribagh',
  'Bokaro',
  'Giridih',
  'Deoghar',
  'Dumka',
  'Palamu',
  'Garhwa',
  'Latehar',
  'Chatra',
  'Koderma',
  'Jamtara',
  'Pakur',
  'Godda',
  'Sahibganj',
  'Khunti',
  'Simdega',
  'Lohardaga',
  'Gumla',
  'Saraikela-Kharsawan',
  'Ramgarh',
];

// ── Confirmation Modal ────────────────────────────────────────────────────────

function ConfirmationModal({
  trackingId,
  onGoHome,
}: {
  trackingId: string;
  onGoHome: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Green success band */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 pt-8 pb-10 text-center relative">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">Problem Submitted!</h2>
          <p className="text-green-100 text-sm mt-1">Your report is now live on JanSamadhan</p>
        </div>

        <div className="px-6 py-5 -mt-4 space-y-4">
          {/* Tracking ID card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Your Tracking ID
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-black text-slate-900 font-mono tracking-wide">
                {trackingId}
              </span>
              <button
                onClick={copyId}
                className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Save this ID to track your submission status
            </p>
          </div>

          {/* Info steps */}
          <div className="space-y-2">
            {[
              'AI is categorizing your problem',
              'It will be routed to a relevant HEI',
              'You will get notified on updates',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600">
                <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0">
                  {i + 1}
                </div>
                {step}
              </div>
            ))}
          </div>

          <button
            onClick={onGoHome}
            className="w-full py-3.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-black text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to My Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────────────────────

function SubmitProblemContent() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [district, setDistrict] = useState(user?.district || '');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [trackingId, setTrackingId] = useState<string | null>(null);

  // ── GPS Handler ───────────────────────────────────────────────────────────

  const handleGpsDetect = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      (err) => {
        setGpsError('Could not detect location. Please enable location permissions.');
        setGpsLoading(false);
      },
      { timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // ── Photo Handler ─────────────────────────────────────────────────────────

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.slice(0, 4 - photos.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 4));
  };

  const removePhoto = (idx: number) => {
    URL.revokeObjectURL(photos[idx].preview);
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submit Handler ────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !domain || !district) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const { db } = await import('@/firebase');
      const {
        collection,
        addDoc,
        serverTimestamp,
      } = await import('firebase/firestore');

      // Generate a human-readable tracking ID
      const shortId = `JS-${Date.now().toString(36).toUpperCase().slice(-6)}`;

      const docData: Record<string, any> = {
        trackingId: shortId,
        title: title.trim(),
        description: description.trim(),
        domain,
        district,
        location: location ? { lat: location.lat, lng: location.lng } : null,
        mediaUrl: null, // placeholder — Storage upload can be wired later
        submittedBy: user?.id || 'anonymous',
        submittedByName: user?.name || 'Citizen',
        submittedByPhone: user?.phoneNumber || null,
        submittedAt: serverTimestamp(),
        status: 'Pending AI Categorization',
        assignedHEI: null,
        urgencyScore: null,
        aiCategory: null,
      };

      await addDoc(collection(db, 'challenges'), docData);
      setTrackingId(shortId);
    } catch (err: any) {
      console.error('[Firestore submit]', err);
      setSubmitError('Failed to submit. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const isValid = title.trim().length >= 5 && description.trim().length >= 10 && domain && district;

  return (
    <>
      {trackingId && (
        <ConfirmationModal
          trackingId={trackingId}
          onGoHome={() => router.replace('/citizen/dashboard')}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900">Submit a Problem</h1>
            <p className="text-xs text-slate-500">समस्या दर्ज करें — Your voice matters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Title ── */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-green-600" />
              Problem Title *
            </label>
            <input
              type="text"
              required
              minLength={5}
              maxLength={120}
              placeholder="e.g. Fungal disease destroying paddy crops in Namkum"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
            <p className="text-[10px] text-slate-400 text-right">{title.length}/120</p>
          </div>

          {/* ── Description ── */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-green-600" />
              Full Description *
            </label>
            <textarea
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              placeholder="Describe the problem in detail — when did it start, how many people are affected, what have you tried..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
            />
            <p className="text-[10px] text-slate-400 text-right">{description.length}/1000</p>
          </div>

          {/* ── Domain + District (side-by-side) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Domain */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-green-600" />
                Domain Category *
              </label>
              <select
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select domain…</option>
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-green-600" />
                District / जिला *
              </label>
              <select
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select district…</option>
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── GPS Location ── */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-green-600" />
              GPS Location (Optional)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGpsDetect}
                disabled={gpsLoading}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-sm font-bold hover:bg-green-100 transition-all disabled:opacity-50 flex-shrink-0"
              >
                {gpsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                {gpsLoading ? 'Detecting…' : 'Auto-Detect Location'}
              </button>

              {location && (
                <div className="flex-1 px-3 py-2.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-mono text-green-800 truncate">
                  <span className="font-bold text-green-700">✓ </span>
                  {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </div>
              )}
            </div>
            {gpsError && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                <X className="w-3.5 h-3.5" /> {gpsError}
              </p>
            )}
          </div>

          {/* ── Photo Upload ── */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-green-600" />
              Photos (up to 4)
            </label>

            {/* Preview grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <img
                      src={p.preview}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            {photos.length < 4 && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-green-50 hover:border-green-400 transition-all text-sm font-semibold text-slate-500 hover:text-green-700 flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  {photos.length === 0 ? 'Upload Photos (optional)' : `Add more (${4 - photos.length} remaining)`}
                </button>
              </>
            )}
          </div>

          {/* ── Error ── */}
          {submitError && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              {submitError}
            </div>
          )}

          {/* ── Submit CTA ── */}
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full py-5 rounded-2xl bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-green-700/30 transition-all flex items-center justify-center gap-3 group"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting to Firestore…
              </>
            ) : (
              <>
                <PlusCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Submit Problem Report
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center">
            Your submission will be AI-categorized and routed to the appropriate institution within minutes.
          </p>
        </form>
      </div>
    </>
  );
}

// ── Page Export ───────────────────────────────────────────────────────────────

export default function SubmitProblemPage() {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['CITIZEN']}>
        <SubmitProblemContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
