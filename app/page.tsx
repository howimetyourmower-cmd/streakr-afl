"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "./_firebaseClient";

export default function Home() {
  const [fixtures, setFixtures] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, "picks"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFixtures(data);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen text-white bg-[#0F1115]">
      {/* --- Hero Section with Background Image --- */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <Image
          src="/mcg-hero.jpg"
          alt="MCG Stadium at Night"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-[#FF7A00] drop-shadow-lg">
            Streakr AFL 2026
          </h1>
          <p className="text-xl text-gray-200 mt-4">
            Make your pick. Build your streak.
          </p>
        </div>
      </div>

      {/* --- Fixtures Section --- */}
      <section className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-semibold text-[#FF7A00] mb-4">
          🔥 Fixtures from Firestore
        </h2>
        {fixtures.length === 0 ? (
          <p className="text-gray-400">No fixtures found.</p>
        ) : (
          fixtures.map((round) => (
            <div key={round.id} className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-orange-400">
                {round.id.toUpperCase()}
              </h3>
              {round.games &&
                round.games.map((game: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <p className="font-semibold">{game.match}</p>
                    <ul className="list-disc list-inside text-gray-300">
                      {game.questions.map((q: any, i: number) => (
                        <li key={i}>{q.q}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ))
        )}
      </section>
    </main>
  );
}
