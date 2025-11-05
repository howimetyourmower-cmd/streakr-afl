// lib/firebaseAdmin.ts
import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";

function resolvePrivateKey(): string {
  const b64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64 || "";
  if (b64.trim()) {
    return Buffer.from(b64, "base64").toString("utf8").replace(/\r?\n/g, "\n");
  }
  const raw = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
  if (raw.trim()) return raw.replace(/\n/g, "\n");
  throw new Error("Admin key missing: set FIREBASE_ADMIN_PRIVATE_KEY_BASE64 (or FIREBASE_ADMIN_PRIVATE_KEY).");
}

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID!;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL!;
const privateKey  = resolvePrivateKey();

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    `Missing Firebase admin envs: ${JSON.stringify({
      FIREBASE_ADMIN_PROJECT_ID: !!projectId,
      FIREBASE_ADMIN_CLIENT_EMAIL: !!clientEmail,
      FIREBASE_ADMIN_PRIVATE_KEY: !!privateKey,
    })}`
  );
}

export const adminApp =
  getApps().length ? getApp() : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
