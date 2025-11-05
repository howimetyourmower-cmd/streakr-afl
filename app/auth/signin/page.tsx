
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/picks");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/picks");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-gray-800 p-8">
        <h1 className="text-center text-2xl font-bold">Sign In</h1>
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">Sign In with Google</Button>
        {error && <p className="text-red-500">{error}</p>}
        <p className="text-center">
          Don't have an account? <a href="/auth/signup" className="text-blue-500">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
