import { NextResponse } from "next/server";
import { adminDb } from "@/src/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const ADMIN_KEY = process.env.ADMIN_KEY;
    const key = req.headers.get("x-admin-key");
    if (!ADMIN_KEY || key !== ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roundId, gameIndex, questionIndex, result } = await req.json();
    if (gameIndex == null || questionIndex == null || !result) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const ref = adminDb.collection("fixtures").doc(roundId);
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
