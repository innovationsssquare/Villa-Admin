import admin from "firebase-admin";

function formatPrivateKey(key) {
  if (!key) return "";
  let cleanKey = key.trim();
  if (
    (cleanKey.startsWith('"') && cleanKey.endsWith('"')) ||
    (cleanKey.startsWith("'") && cleanKey.endsWith("'"))
  ) {
    cleanKey = cleanKey.slice(1, -1);
  }
  cleanKey = cleanKey.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();
  return cleanKey;
}

export function getFirebaseAdminAuth() {
  if (admin.apps.length > 0) {
    return admin.auth();
  }

  const rawKey =
    process.env.FIREBASE_PRIVATE_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY ||
    "";
  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL ||
    process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL;
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!clientEmail || !rawKey) {
    throw new Error(
      "Firebase Admin credentials not configured on server. Please ensure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are set in Vercel environment variables."
    );
  }

  const privateKey = formatPrivateKey(rawKey);

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (initErr) {
    console.error("Firebase Admin initialization failed:", initErr);
    throw new Error(`Firebase Admin initialization failed: ${initErr.message}`);
  }

  return admin.auth();
}

export const verifyFirebaseIdToken = async (token) => {
  if (!token) {
    throw new Error("Google ID token is required");
  }
  const auth = getFirebaseAdminAuth();
  return await auth.verifyIdToken(token);
};

