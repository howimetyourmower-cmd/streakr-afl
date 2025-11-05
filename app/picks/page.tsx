
"use client";

import { useEffect, useState } from "react";

export default function PicksPage() {
  const [roundId, setRoundId] = useState<string | null>(null);
  const [round, setRound] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const res = await fetch('/api/picks');
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch picks");
        }
        const data = await res.json();
        setRoundId(data.roundId);
        setRound(data.round);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPicks();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-400">{error}</div>;
  }

  const games = Array.isArray((round as any)?.games) ? (round as any).games : [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">
        🔥 Upcoming Picks — {roundId?.replace("round-", "Round ")}
      </h2>
      {games.length === 0 ? (
        <div className="text-gray-400">No games found in {roundId}.</div>
      ) : (
        games.map((game: any, i: number) => (
          <div key={i} className="mb-6 bg-gray-800 p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-orange-400 mb-2">
              {game.match}
            </h3>
            <ul className="space-y-2">
              {(game.questions || []).map((q: any, j: number) => (
                <li key={j} className="text-gray-200">
                  • {q.question}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
