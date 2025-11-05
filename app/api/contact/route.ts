// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    await adminDB.collection("contact_messages").add({
      name,
      email,
      message,
      createdAt: FieldValue.serverTimestamp(),
      userAgent: req.headers.get("user-agent") || "",
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
