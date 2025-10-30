"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "./_firebaseClient";

export default function Home() {
  const [rounds, setRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, "picks"));

        const roundsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRounds(roundsData);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main
      style={{
        background: "radial-gradient(circle at center, #0a0a0f, #0b0e16)",
        color: "#EEE",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔥 Streakr AFL 2026</h1>
      <h3>Fixtures from Firestore</h3>

      {loading ? (
        <p>Loading...</p>
      ) : rounds.length === 0 ? (
        <p>No fixtures found.</p>
      ) : (
        rounds.map((round) => (
          <div
            key={round.id}
            style={{
              background: "#12141a",
              borderRadius: "12px",
              padding: "1rem",
              marginTop: "1.5rem",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.05)",
            }}
          >
            <h2 style={{ color: "#FF7A00" }}>🏉 {round.id.toUpperCase()}</h2>
            {Array.isArray(round.games) ? (
              round.games.map((game: any, i: number) => (
                <div key={i} style={{ marginTop: "1rem" }}>
                  <h3>{game.match}</h3>
                  <ul>
                    {Array.isArray(game.questions) &&
                      game.questions.map((q: any, qi: number) => (
                        <li key={qi}>{q.q}</li>
                      ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No games found for this round.</p>
            )}
          </div>
        ))
      )}
    </main>
  );
}
