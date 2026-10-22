import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
    const privateKey = rawKey.replace(/\\n/g, "\n").replace(/^"|"$/g, "");
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      console.warn("Firebase Admin credentials not configured (FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY missing)");
    }
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

