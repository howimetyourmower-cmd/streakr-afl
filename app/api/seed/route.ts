// app/api/seed/route.ts
import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

export const runtime = "nodejs";           // <-- important on Vercel (no Edge)
export const dynamic = "force-dynamic";    // ensure it runs server-side each time

function getServiceAccount() {
  const {
    FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY,
  } = process.env as Record<string, string | undefined>;

  if (!FIREBASE_ADMIN_PROJECT_ID) throw new Error("Missing FIREBASE_ADMIN_PROJECT_ID");
  if (!FIREBASE_ADMIN_CLIENT_EMAIL) throw new Error("Missing FIREBASE_ADMIN_CLIENT_EMAIL");
  if (!FIREBASE_ADMIN_PRIVATE_KEY) throw new Error("Missing FIREBASE_ADMIN_PRIVATE_KEY");

  // Accept either single-line with \n or real multiline
  const privateKey =
    FIREBASE_ADMIN_PRIVATE_KEY.includes("\\n")
      ? FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
      : FIREBASE_ADMIN_PRIVATE_KEY;

  return {
    projectId: FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey,
  };
}

function getDb() {
  if (!admin.apps.length) {
    const sa = getServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: sa.projectId,
        clientEmail: sa.clientEmail,
        privateKey: sa.privateKey,
      }),
    });
  }
  return admin.firestore();
}

export async function GET() {
  // simple sanity check route
  return NextResponse.json({ ok: true, route: "/api/seed", method: "GET" });
}

export async function POST(request: Request) {
  try {
    // optional lock so only you can run it
    const seedEmail = request.headers.get("x-seed-email");
    if (process.env.SEED_ADMIN_EMAIL && seedEmail !== process.env.SEED_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb();

    // --- YOUR SEEDING LOGIC HERE ---
    // Example:
    // await db.collection("picks").doc("status").set({ ready: true, ts: admin.firestore.FieldValue.serverTimestamp() });

    return NextResponse.json({ message: "✅ Firestore seeded successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
