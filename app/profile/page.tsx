
"use client";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseClient";
import { PageHeader } from "@/components/PageHeader";

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const [picks, setPicks] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await fetch(`/api/profile?uid=${encodeURIComponent(user.uid)}`);
      const json = await res.json();
      setPicks(json);
    })();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Your Profile" subtitle={user ? `Signed in as ${user.email}` : ""} />

      {!user && <p>Loading profile...</p>}

      {user && (
        <div>
          <h2 className="mb-4 text-xl font-bold">Pick History</h2>
          {picks.length > 0 ? (
            <div className="space-y-4">
              {picks.map((pick) => (
                <div key={pick.id} className="rounded-lg bg-gray-800 p-4">
                  <p className="font-semibold">{pick.question}</p>
                  <p>Your pick: {pick.choice}</p>
                  <p>Result: {pick.result || "Pending"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't made any picks yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
