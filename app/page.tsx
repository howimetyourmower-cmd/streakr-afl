"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "./_firebaseClient";

// Types for safety (optional)
type Question = {
  quarter?: number;
  question?: string;
  status?: string;
};

type Game = {
  match?: string; // e.g., "Richmond vs Carlton"
  questions?: Question[];
};

type Fixture = {
  id?: string;
  round?: number;
  season?: number;
  games?: Game[];
};

export default function Home() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);
        const snap = await getDocs(collection(db, "fixtures"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Fixture[];

        // Sort by round if present
        data.sort((a, b) => {
          const ra = typeof a.round === "number" ? a.round : 9999;
          const rb = typeof b.round === "number" ? b.round : 9999;
          return ra - rb;
        });

        setFixtures(data);
      } catch (e: any) {
        console.error("Error fetching Firestore data:", e);
        setErr(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: "24px", color: "#EEE", background: "#0F1115", minHeight: "100dvh" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>🔥 Streakr AFL 2026</h1>
      <p style={{ opacity: 0.75, marginBottom: 24 }}>Fixtures from Firestore</p>

      {loading && <p>Loading…</p>}
      {err && (
        <p style={{ color: "#ff6b6b", marginTop: 12 }}>
          Error: {err}
        </p>
      )}

      {!loading && !err && fixtures.length === 0 && <p>No fixtures found.</p>}

      {!loading && !err && fixtures.length > 0 && (
        <div style={{ display: "grid", gap: 16 }}>
          {fixtures.map((fixture) => (
            <section
              key={fixture.id}
              style={{
                border: "1px solid #222",
                borderRadius: 12,
                padding: 16,
                background: "#131721",
              }}
            >
              <h2 style={{ fontSize: 22, marginBottom: 8 }}>
                Round {fixture.round ?? "—"} {fixture.season ? `• ${fixture.season}` : ""}
              </h2>

              {Array.isArray(fixture.games) && fixture.games.length > 0 ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {fixture.games.map((game, gi) => (
                    <div
                      key={`${fixture.id}-game-${gi}`}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        background: "#0f1420",
                        border: "1px solid #1c2233",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 8 }}>
                        {game.match || "Match TBC"}
                      </div>

                      {Array.isArray(game.questions) && game.questions.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {game.questions.map((q, qi) => (
                            <li key={`${fixture.id}-game-${gi}-q-${qi}`} style={{ marginBottom: 6 }}>
                              {q.quarter ? `Q${q.quarter}: ` : ""}
                              {q.question || "Question TBC"}
                              {q.status ? (
                                <span style={{ opacity: 0.7 }}> • {q.status}</span>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div style={{ opacity: 0.7 }}>No questions yet.</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ opacity: 0.7 }}>No games loaded for this round.</div>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
