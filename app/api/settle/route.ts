import { NextResponse } from "next/server";
import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault() || cert({
      // fall back to env vars if needed in your environment
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    })
  });
}

export async function POST(req: Request) {
  try {
    const ADMIN_KEY = process.env.ADMIN_KEY; // set in Vercel/Studio
    const key = req.headers.get("x-admin-key");
    if (!ADMIN_KEY || key !== ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roundId = "round1", gameIndex, questionIndex, result } = await req.json();
    if (gameIndex == null || questionIndex == null || !result) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = getFirestore();
    const ref = db.collection("picks").doc(roundId);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Round not found" }, { status: 404 });

    const data = snap.data()!;
    data.games[gameIndex].questions[questionIndex].result = result; // e.g., "YES" | "NO" | "VOID"
    await ref.set(data, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
