// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyB6hEtkluX_pQL0ZpS_2Yw5hnCgBiUxtJ0",
   authDomain: "leak-media.firebaseapp.com",
   projectId: "leak-media",
   storageBucket: "leak-media.firebasestorage.app",
   messagingSenderId: "816856517735",
   appId: "1:816856517735:web:49f0542efe90a2ef7198c2",
   measurementId: "G-970XXZBWM1"
 };

import { getApps, getApp } from "firebase/app";

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, db, analytics, googleProvider };
