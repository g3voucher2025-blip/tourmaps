import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Defensive: if required env vars are missing, avoid initializing Firebase
const isConfigValid = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app = null;
let auth = null;
let db = null;

if (!isConfigValid) {
  // Clear, actionable message for devs (appears in browser console when this module is imported)
  // This prevents the uncaught FirebaseError: auth/invalid-api-key seen when keys are missing.
  // Create a `.env.local` at the project root (see `.env.local.example`) with the VITE_FIREBASE_* vars
  // and restart the dev server to load them.
  // Example keys: VITE_FIREBASE_API_KEY=...
  // Do NOT commit your real keys to version control.
  // We intentionally don't throw here so the app can render and we can show a friendly error.
  // eslint-disable-next-line no-console
  console.error(
    "Firebase config is missing or incomplete. Please create a .env.local with VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID (see .env.local.example). Firebase auth/db will be disabled until configured."
  );
} else {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
export default app;