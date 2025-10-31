"use client";

import Image from "next/image";
import Link from "next/link";
import PicksPreview from "./components/PicksPreview";

export default function Home() {
  return (
    <main className="min-h-screen text-[#EEE] bg-[#0F1115]">
      {/* Hero */}
      <section className="relative h-[38vh] w-full overflow-hidden">
        <Image
          src="/mcg-hero.jpg"
          alt="MCG at night"
          fill
          priority
          className="object-cover"
        />
        {/* darken overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow">
              Streakr AFL 2026
            </h1>
            <p className="mt-3 text-lg md:text-xl text-gray-200">
              Make your pick, build your streak.
            </p>

            {/* Primary CTA */}
            <div className="mt-6">
              <Link
                href="/picks"
                className="inline-block rounded-xl bg-[#FF7A00] px-5 py-3 text-black font-semibold hover:opacity-90 transition"
              >
                Make a Pick
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor banner (optional placeholder) */}
      <section className="px-6 md:px-10 -mt-6">
        <div
          className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800
                     p-4 md:p-5 shadow-[0_0_30px_-10px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm uppercase tracking-widest text-gray-400">Sponsored</div>
            <div className="text-base md:text-lg font-semibold text-gray-100">
              TCL 4K Game Mode — See every play
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Picks */}
      <section className="px-6 md:px-10 mt-10 mb-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#FF7A00] text-xl">🔥</span>
          <h2 className="text-2xl font-bold">Upcoming Picks</h2>
        </div>
        <PicksPreview />
      </section>
    </main>
  );
}

