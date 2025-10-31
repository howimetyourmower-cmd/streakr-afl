"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../_firebaseClient";

type Question = { q: string };
type Game = { match: string; questions: Question[] };
type RoundDoc = { games: Game[] };

export default function PicksPreview() {
  const [cards, setCards] = useState<{ match: string; q: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const db = getFirestore(app);
        const snap = await getDocs(collection(db, "picks"));
        let round: RoundDoc | null = null;
        snap.forEach((d) => {
          if (d.id.toLowerCase() === "round1") round = d.data() as RoundDoc;
        });
        if (!round && !snap.empty) round = snap.docs[0].data() as RoundDoc;

        const out: { match: string; q: string }[] = [];
        if (round?.games?.length) {
          for (const g of round.games) {
            for (const qu of g.questions || []) {
              out.push({ match: g.match, q: qu.q });
              if (out.length === 6) break;
            }
            if (out.length === 6) break;
          }
        }
        setCards(out);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="opacity-70">Loading…</div>;
  if (cards.length === 0) return <div className="opacity-70">No fixtures found.</div>;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-4 opacity-90">Upcoming Picks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <article key={i}
            className="rounded-2xl bg-white/5 border border-white/10 p-4 transition
                       hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,122,0,.25)]">
            <div className="text-xs uppercase tracking-wider opacity-70">Match</div>
            <div className="font-semibold">{c.match}</div>
            <div className="mt-2 text-sm opacity-90">{c.q}</div>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs">Yes</span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs">No</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
