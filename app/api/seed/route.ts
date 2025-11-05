import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (!payload?.round) return NextResponse.json({ ok: false, error: "Missing round" }, { status: 400 });

    const ref = adminDB.collection("fixtures").doc(`round-${payload.round}`);
    const exists = (await ref.get()).exists;
    if (exists) return NextResponse.json({ ok: true, skipped: `round-${payload.round}` });

    await ref.set(payload);
    return NextResponse.json({ ok: true, written: `fixtures/round-${payload.round}` });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
