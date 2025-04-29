import { getApps, getApp } from "firebase/app";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with proper TypeScript types
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Check if we're in the browser environment
if (typeof window !== 'undefined') {
  // Only initialize Firebase in browser environment
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Analytics can be imported and initialized only in browser
  if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    // Dynamic import for analytics
    import('firebase/analytics').then(({ getAnalytics }) => {
      getAnalytics(app);
    }).catch(error => console.log('Analytics failed to load:', error));
  }
} else {
  // Create a mock implementation for SSR that satisfies TypeScript
  // This is a workaround - these objects will be replaced with real ones on client side
  app = {} as FirebaseApp;
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
  } as unknown as Auth;
  db = {} as Firestore;
}

export { app, auth, db };
