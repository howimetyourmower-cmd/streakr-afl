// app/api/questions/route.ts
import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebaseAdmin";

export const runtime = "nodejs"; // ensure Node runtime for Vercel
export async function GET() {
  try {
    const db = getFirestore(adminApp);
    // Adjust round id if needed (e.g., "round-1")
    const snap = await db.collection("fixtures").doc("round-1").get();
    if (!snap.exists) return NextResponse.json({ questions: [] });

    const data = snap.data() as any;
    // Expecting { games: [{ match, questions: [{ quarter, question }] }, ...] }
    const questions: Array<{ id: string; text: string; quarter: number; match: string; status: "open" | "pending" | "final" }> = [];

    (data.games || []).forEach((g: any, gi: number) => {
      (g.questions || []).forEach((q: any, qi: number) => {
        questions.push({
          id: `${gi}-${qi}`,
          text: q.question,
          quarter: q.quarter,
          match: g.match,
          status: "open",
        });
      });
    });

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("GET /api/questions failed", err);
    return NextResponse.json({ questions: [] }, { status: 500 });
  }
}
