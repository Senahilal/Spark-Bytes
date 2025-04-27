import { getApps, getApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import analytics conditionally

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with server-side rendering check
let app, auth, db;

if (typeof window !== 'undefined') {
  // Only initialize Firebase in browser environment
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Analytics can be imported and initialized only in browser
  if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    import('firebase/analytics').then(({ getAnalytics }) => {
      getAnalytics(app);
    });
  }
} else {
  // Mock implementations for SSR
  app = {}; 
  auth = {};
  db = {};
}

export { app, auth, db };
