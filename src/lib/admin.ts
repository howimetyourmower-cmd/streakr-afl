import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function buildServiceAccount() {
  const b64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64;
  if (!b64) throw new Error("Missing FIREBASE_ADMIN_PRIVATE_KEY_BASE64");

  const decoded = Buffer.from(b64, "base64").toString("utf8").trim();

  try {
    // base64 of full JSON
    const parsed = JSON.parse(decoded);
    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: String(parsed.private_key).replace(/\n/g, "\n"),
    };
  } catch {
    // fallback if only PEM
    return {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: decoded.replace(/\n/g, "\n"),
    };
  }
}

let app: App;
if (!getApps().length) {
  const sa = buildServiceAccount();
  app = initializeApp({ credential: cert(sa), projectId: sa.projectId });
} else {
  app = getApps()[0]!;
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
