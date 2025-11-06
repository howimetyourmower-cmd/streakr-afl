
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getClientAuth, getClientDb } from "@/src/lib/firebaseClient";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");
  const [favouriteTeam, setFavouriteTeam] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError("You must be at least 18 years old to sign up.");
      return;
    }

    try {
      const auth = getClientAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const db = getClientDb();
      await setDoc(doc(db, "users", user.uid), {
        name,
        suburb,
        state,
        favouriteTeam,
        dob,
      });
      router.push("/picks");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-gray-800 p-8">
        <h1 className="text-center text-2xl font-bold">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input type="text" placeholder="Suburb" value={suburb} onChange={(e) => setSuburb(e.target.value)} required />
          <Input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
          <Input type="text" placeholder="Favourite Team" value={favouriteTeam} onChange={(e) => setFavouriteTeam(e.target.value)} required />
          <Input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} required />
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <p className="text-center">
          Already have an account? <a href="/auth/signin" className="text-blue-500">Sign In</a>
        </p>
      </div>
    </div>
  );
}
