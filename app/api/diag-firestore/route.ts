export const runtime = "nodejs";

import { adminDb } from "@/src/lib/admin";

export async function GET() {
  try {
    // lightweight read that always exists
    const time = new Date().toISOString();
    return Response.json({ ok: true, serverTime: time });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 });
  }
}
