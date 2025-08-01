/**
 * Firebase client initialization for Leak Media
 * Uses Vercel/Env-provided variables for static deployments.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB6hEtkluX_pQL0ZpS_2Yw5hnCgBiUxtJ0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "leak-media.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "leak-media",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "leak-media.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "816856517735",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:816856517735:web:49f0542efe90a2ef7198c2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-970XXZBWM1",
};

// Initialize Firebase (avoid double init in dev/HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, db, analytics, googleProvider };
