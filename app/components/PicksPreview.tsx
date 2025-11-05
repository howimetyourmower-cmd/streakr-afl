
"use client";

import { useEffect, useState } from "react";

type Question = { quarter: number; question: string };
type Game = { match: string; questions: Question[] };

export default function PicksPreview() {
  const [games, setGames] = useState<Game[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/fixtures');
        if (!res.ok) {
          throw new Error('Failed to fetch fixtures');
        }
        const data = await res.json();
        setGames(Array.isArray(data.games) ? data.games : []);
      } catch (e: any) {
        console.error("Failed to load fixtures:", e);
        setError("Could not load picks. Please try again later.");
      }
    })();
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (games === null) return <p>Loading picks...</p>;
  if (!games.length) return <p>No picks available yet.</p>;

  return (
    <div className="space-y-6">
      {games.map((g, i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow">
          <h3 className="text-xl font-semibold text-orange-400">{g.match}</h3>
          <ul className="mt-4 space-y-3">
            {g.questions?.map((q, qi) => (
              <li key={qi} className="flex items-center justify-between rounded-xl bg-black/30 p-3">
                <div>
                  <p className="text-sm uppercase text-white/60">Q{q.quarter}</p>
                  <p className="text-base">{q.question}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/20 transition">Yes</button>
                  <button className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/20 transition">No</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
