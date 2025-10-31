"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getFirestore, collection, doc, getDoc, getDocs, query, limit } from "firebase/firestore";
import { app } from "./_firebaseClient";

// --- Types ---
type UpcomingPick = {
  id: string;
  match: string;
  question: string;
};

// --- Page ---
export default function Home() {
  const [picks, setPicks] = useState<UpcomingPick[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const db = getFirestore(app);

        // Try a flat “upcomingPicks” collection first (if you add one later).
        const upq = query(collection(db, "upcomingPicks"), limit(6));
        const upsnap = await getDocs(upq);

        if (!upsnap.empty) {
          const rows: UpcomingPick[] = upsnap.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<UpcomingPick, "id">),
          }));
          setPicks(rows);
          setLoading(false);
          return;
        }

        // Fallback: derive from your seeded Round 1 doc: picks/round1 (games[].questions[])
        const round1Ref = doc(db, "picks", "round1");
        const round1Snap = await getDoc(round1Ref);

        if (round1Snap.exists()) {
          const data = round1Snap.data() as any;
          // Expected shape (your seed): { games: [{ match: string, questions: [{ q: string }, ...] }, ...] }
          const flattened: UpcomingPick[] = [];
          for (const g of data.games ?? []) {
            for (const qitem of g.questions ?? []) {
              if (qitem?.question || qitem?.q) {
                flattened.push({
                  id: `${g.match}-${qitem.question ?? qitem.q}`,
                  match: g.match,
                  question: qitem.question ?? qitem.q,
                });
              }
            }
          }
          setPicks(flattened.slice(0, 6));
        } else {
          setPicks([]);
        }
      } catch (e) {
        console.error("Failed to load picks:", e);
        setPicks([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const placeholderPicks: UpcomingPick[] = [
    { id: "ph1", match: "Richmond vs Carlton", question: "Will Carlton win or draw against Richmond?" },
    { id: "ph2", match: "Hawthorn vs Essendon", question: "Will Hawthorn win by 22+ points?" },
    { id: "ph3", match: "Sydney vs Collingwood", question: "Will Nick Daicos have 25+ disposals?" },
    { id: "ph4", match: "Geelong vs Melbourne", question: "Will there be 3+ goals in Q1?" },
    { id: "ph5", match: "Brisbane vs Adelaide", question: "Will Lachie Neale 7+ disposals in Q2?" },
    { id: "ph6", match: "Fremantle vs West Coast", question: "Will a ruckman kick a goal?" },
  ];

  const grid = (picks?.length ?? 0) > 0 ? (picks as UpcomingPick[]) : placeholderPicks;

  return (
    <main className="min-h-screen bg-[#0F1115] text-[#EEE]">
      {/* NAV – if your layout already has nav, you can remove this block */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#FF7A00]" />
            <span className="font-semibold tracking-wide">Streakr</span>
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="/" className="opacity-90 hover:opacity-100">Home</a>
            <a href="/picks" className="opacity-90 hover:opacity-100">Picks</a>
            <a href="/leaderboard" className="opacity-90 hover:opacity-100">Leaderboard</a>
            <a href="/faq" className="opacity-90 hover:opacity-100">FAQ</a>
            <a href="/rewards" className="opacity-90 hover:opacity-100">Rewards</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/auth"
              className="rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:border-white/20 hover:bg-white/5"
            >
              Sign in
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        {/* Background image (put a file at /public/hero-mcg.jpg for best effect) */}
        <div className="absolute inset-0 -z-10">
          {/* Fallback gradient if image missing */}
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-20%,#1b2430,transparent),radial-gradient(800px_400px_at_80%_-20%,#151b22,transparent)]" />
          <Image
            src="/hero-mcg.jpg"
            alt="MCG at night"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F1115]/30 to-[#0F1115]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h1 className="text-3xl font-bold md:text-5xl">Streakr — Make your Pick, Build your Streak</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Keep picking right to grow your streak. One wrong pick and you start again.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="/picks"
              className="rounded-xl bg-[#FF7A00] px-5 py-2.5 text-sm font-semibold text-black hover:brightness-110"
            >
              View Picks
            </a>
            <a
              href="/leaderboard"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm hover:border-white/20 hover:bg-white/5"
            >
              Leaderboard
            </a>
          </div>

          {/* Sponsored banner */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider">Sponsored</span>
                <span className="opacity-90">TCL 4K Game Mode — See every play.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-75">Presented by</span>
                <div className="rounded bg-white px-2 py-1 text-[11px] font-semibold text-black">TCL</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-xl font-semibold">How it works</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { title: "Pick", desc: "Choose from bite-size AFL questions.", icon: "🟠" },
            { title: "Lock", desc: "Lock it before the cutoff.", icon: "🔒" },
            { title: "Settle", desc: "We settle each question after play.", icon: "✅" },
            { title: "Streak", desc: "Keep winning picks to grow your streak.", icon: "🔥" },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:translate-y-[-2px] hover:bg-white/[0.08]"
            >
              <div className="text-2xl">{c.icon}</div>
              <div className="mt-2 font-semibold">{c.title}</div>
              <div className="text-sm text-white/80">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* UPCOMING PICKS */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Picks</h2>
          <a href="/picks" className="text-sm text-[#FF7A00] hover:underline">See all</a>
        </div>

        {loading ? (
          <div className="text-white/70">Loading…</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grid.slice(0, 6).map((p) => (
              <a
                key={p.id}
                href="/picks"
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_#FF7A00,0_10px_30px_-10px_rgba(255,122,0,0.5)]"
              >
                <div className="text-xs uppercase tracking-wider text-white/60">Match</div>
                <div className="truncate font-semibold">{p.match}</div>
                <div className="mt-2 text-sm text-white/85">{p.question}</div>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#FF7A00] opacity-90 group-hover:opacity-100">
                  Make your pick →
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
