"use client";
import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  async function handleGoogleSignIn() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onClose();
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Sign in to make your picks</h2>
        <p className="mb-6 text-gray-600 text-sm">
          You can view picks without signing in, but to start your streak you’ll need to sign in.
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="mb-3 w-full rounded-lg bg-orange-600 py-2 font-medium text-white hover:bg-orange-700"
        >
          Continue with Google
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full text-sm text-gray-500 underline"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
