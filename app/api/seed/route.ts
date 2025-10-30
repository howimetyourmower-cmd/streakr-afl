// app/api/seed/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function initAdmin() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID!;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL!;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n");

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

export async function GET() {
  try {
    const app = initAdmin();
    const db = admin.firestore(app);

    const seedData = {
      season: 2026,
      round: 1,
      games: [
        {
          match: "Richmond vs Carlton",
          questions: [
            { q: "Will Carlton win or draw against Richmond?" },
            { q: "Will Patrick Cripps get 6+ disposals in Q1?" },
          ],
        },
        {
          match: "Hawthorn vs Essendon",
          questions: [
            { q: "Will Hawthorn win by 22+ points?" },
            { q: "Will Kyle Langford kick a goal in Q1?" },
          ],
        },
      ],
    };

    await db.collection("picks").doc("round1").set(seedData);
    return NextResponse.json({ message: "✅ Firestore seeded successfully" });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
