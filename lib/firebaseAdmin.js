import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const rawKey = process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY || "";
    const privateKey = rawKey.replace(/\\n/g, "\n").replace(/^"|"$/g, "");
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (initErr) {
    console.error("Firebase Admin initialization failed:", initErr);
  }
}

export const verifyFirebaseIdToken = async (token) => {
  try {
    if (!token) return null;
    return await admin.auth().verifyIdToken(token);
  } catch (err) {
    console.error("Firebase token verification error:", err.message || err);
    return null;
  }
};

