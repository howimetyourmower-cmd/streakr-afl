import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: Buffer.from(
            process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64 || "",
            "base64"
          ).toString("utf8"),
        }),
      });

// ✅ Export both adminApp and adminDB
export const adminDB = getFirestore(adminApp);
export { adminApp };