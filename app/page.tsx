"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "./_firebaseClient";

export default function Home() {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, "fixtures"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: "2rem", color: "#fff", background: "#0F1115" }}>
      <h1>🔥 Streakr AFL 2026</h1>
      <h2>Fixtures from Firestore</h2>

      {questions.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {questions.map((item, idx) => (
            <li key={idx}>{item.round ? `Round ${item.round}` : JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
