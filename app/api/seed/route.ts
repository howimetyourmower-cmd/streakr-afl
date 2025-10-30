import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export async function GET() {
  try {
    const seedData = {
      season: 2026,
      round: 1,
      games: [
        {
          match: "Richmond vs Carlton",
          questions: [
            { q: "Will Carlton win or draw against Richmond?" },
            { q: "Will Patrick Cripps get 6 or more disposals in Q1?" },
          ],
        },
        {
          match: "Hawthorn vs Essendon",
          questions: [
            { q: "Will Hawthorn beat Essendon by 22 points or more?" },
            { q: "Will Kyle Langford kick a goal in Q1?" },
          ],
        },
      ],
    };

    await db.collection("picks").doc("round1").set(seedData);
    return NextResponse.json({ message: "Seed data added successfully" });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
