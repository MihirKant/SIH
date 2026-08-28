/**
 * src/lib/firebase.ts
 * -------------------------------------------------
 * Firebase App & Auth initializer for JanSamadhan.
 *
 * Auth strategy:
 *   • Citizen          → Phone Number OTP (signInWithPhoneNumber)
 *   • HEI / Industry / Govt → Google OAuth (signInWithPopup)
 *
 * All config values are read from NEXT_PUBLIC_ env vars so they
 * are safe to ship client-side (they are public by nature in
 * Firebase's security model — actual security is enforced by
 * Firebase Security Rules and domain whitelisting).
 * -------------------------------------------------
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  PhoneAuthProvider,
} from 'firebase/auth';

// ── Firebase project configuration ──────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ── Singleton app init (safe for Next.js hot-reloads) ────────────────────────
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// ── Auth instance ─────────────────────────────────────────────────────────────
const auth: Auth = getAuth(app);

// ── Google OAuth provider (for HEI / Industry / Govt roles) ─────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
// Request account selection even when already signed in
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── Phone Auth provider (for Citizen role) ────────────────────────────────────
const phoneProvider = new PhoneAuthProvider(auth);

/**
 * Creates an INVISIBLE reCAPTCHA verifier bound to a DOM container id.
 * Call this just before `signInWithPhoneNumber` — do NOT call during SSR.
 *
 * @param containerId  id of the div to attach reCAPTCHA to (e.g. "recaptcha-container")
 * @returns RecaptchaVerifier instance
 */
function createRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved — OTP can be sent
    },
    'expired-callback': () => {
      // reCAPTCHA expired — user must retry
    },
  });
}

export {
  app,
  auth,
  googleProvider,
  phoneProvider,
  createRecaptchaVerifier,
};
