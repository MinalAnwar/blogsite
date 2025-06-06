import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env?.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env?.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export { onAuthStateChanged };