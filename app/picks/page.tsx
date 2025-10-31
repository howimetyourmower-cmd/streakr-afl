"use client";
import { useEffect, useState } from "react";
import { app } from "../_firebaseClient";
import { getFirestore, doc, getDoc } from "firebase/firestore";

type Question = { q: string };
type Game = { match: string; questions: Question[] };
type RoundDoc = { games: Game[] };

export default function PicksPage() {
  const [round, setRound] = useState<RoundDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const db = getFirestore(app);
        const snap = await getDoc(doc(db, "picks", "round1"));
        if (snap.exists()) setRound(snap.data() as RoundDoc);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Picks</h1>
      {loading ? <div>Loading…</div> : !round ? (
        <div>No picks yet.</div>
      ) : (
        <div className="space-y-6">
          {round.games.map((g, i) => (
            <div key={i} className="rounded-2xl border border-white/10 p-4 bg-white/5">
              <div className="text-sm uppercase opacity-70">Match</div>
              <div className="font-semibold">{g.match}</div>
              <ul className="mt-3 space-y-2">
                {g.questions.map((qq, j) => (
                  <li key={j} className="flex items-center justify-between gap-3">
                    <span>{qq.q}</span>
                    <div className="flex gap-2">
                      <button className="rounded-md border border-white/15 px-3 py-1 text-xs hover:bg-white/10">Yes</button>
                      <button className="rounded-md border border-white/15 px-3 py-1 text-xs hover:bg-white/10">No</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}