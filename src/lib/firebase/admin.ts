import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let app;
try {
  if (getApps().length > 0) {
    app = getApps()[0];
  } else if (serviceAccount.privateKey) {
    app = initializeApp({ credential: cert(serviceAccount) });
  }
} catch (error) {
  console.warn("Firebase Admin init error (safe to ignore during build):", error);
}

export const adminAuth = app ? getAuth(app) : null;

export async function verifyToken(token: string) {
  if (!adminAuth) return null;
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { 
      uid: decodedToken.uid, 
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture
    };
  } catch {
    return null;
  }
}
