/**
 * Firebase client initialization for Leak Media
 * Uses Vercel/Env-provided variables for static deployments.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Safe access to environment variables that works with/without typed ImportMeta
const safeEnv = (key: string): string | undefined => {
  // Defensive check for Vite/Astro's import.meta.env without relying on its types
  const viteVal =
    typeof window !== "undefined" &&
    typeof (globalThis as any).import !== "undefined" &&
    typeof ((globalThis as any).import.meta) !== "undefined" &&
    (globalThis as any).import.meta.env &&
    (globalThis as any).import.meta.env[key];

  // Fallback for SSR/Node environments
  const nodeVal =
    typeof process !== "undefined" &&
    typeof process.env !== "undefined" &&
    process.env[key];

  return viteVal ?? nodeVal ?? undefined;
};

const firebaseConfig = {
  apiKey: safeEnv("VITE_FIREBASE_API_KEY") || "AIzaSyB6hEtkluX_pQL0ZpS_2Yw5hnCgBiUxtJ0",
  authDomain: safeEnv("VITE_FIREBASE_AUTH_DOMAIN") || "leak-media.firebaseapp.com",
  projectId: safeEnv("VITE_FIREBASE_PROJECT_ID") || "leak-media",
  storageBucket: safeEnv("VITE_FIREBASE_STORAGE_BUCKET") || "leak-media.firebasestorage.app",
  messagingSenderId: safeEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || "816856517735",
  appId: safeEnv("VITE_FIREBASE_APP_ID") || "1:816856517735:web:49f0542efe90a2ef7198c2",
  measurementId: safeEnv("VITE_FIREBASE_MEASUREMENT_ID") || "G-970XXZBWM1",
};

// Initialize Firebase (avoid double init in dev/HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, db, analytics, googleProvider };
