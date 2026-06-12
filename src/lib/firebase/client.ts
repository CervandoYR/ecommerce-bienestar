import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, type User } from 'firebase/auth';
import { firebaseConfig } from './config';

const isConfigured = typeof window !== 'undefined' || (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your-api-key');
const app = isConfigured ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)) : null;

export const auth = app ? getAuth(app) : null as any;
export const googleProvider = app ? new GoogleAuthProvider() : null as any;

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export { onAuthStateChanged, type User };
