// app/api/seed/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";       // ensure Node runtime (not edge)
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/seed", method: "GET" });
}
