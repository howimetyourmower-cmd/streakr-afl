"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, DocumentData } from "firebase/firestore";
import { app } from "../_firebaseClient";
import Link from "next/link";

type PickCard = {
  match: string;
  question: string;
};

export default function PicksPreview() {
  const [items, setItems] = useState<PickCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const db = getFirestore(app);
        // Grab all docs in "picks" (e.g. round1, round2...)
        const snap = await getDocs(collection(db, "picks"));

        const cards: PickCard[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as DocumentData;
          const games: any[] = data.games ?? [];
          for (const g of games) {
            const match: string = g.match ?? "";
            const questions: any[] = g.questions ?? [];
            for (const q of questions) {
              if (q?.question) {
                cards.push({ match, question: q.question });
              }
            }
          }
        });

        // Take only the first 6 for the preview
        setItems(cards.slice(0, 6));
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load picks");
      }
    })();
  }, []);

  if (error) {
    return <p className="text-red-400">Error loading picks: {error}</p>;
  }

  if (items === null) {
    return <p className="text-gray-300">Loading picks…</p>;
  }

  if (items.length === 0) {
    return <p className="text-gray-300">No picks available yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur
                       p-4 hover:shadow-lg hover:shadow-orange-500/20 transition
                       duration-200 group"
          >
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
              Upcoming Pick
            </p>
            <h4 className="text-base font-semibold text-gray-100 mb-1">
              {item.match}
            </h4>
            <p className="text-sm text-gray-300">{item.question}</p>
          </div>
        ))}
      </div>

      <div className="text-right">
        <Link
          href="/picks"
          className="inline-block rounded-lg bg-[#FF7A00] px-4 py-2 font-medium
                     text-black hover:opacity-90 transition"
        >
          Make a Pick →
        </Link>
      </div>
    </div>
  );
}
