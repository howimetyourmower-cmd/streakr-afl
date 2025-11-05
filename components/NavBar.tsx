
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { User } from "firebase/auth";

// This should be in a separate config file
const ADMIN_UIDS = ["YOUR_ADMIN_UID_HERE"]; // Replace with actual Admin UIDs

const NavBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const isAuthorizedAdmin = user ? ADMIN_UIDS.includes(user.uid) : false;


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-2xl font-bold text-white transition-colors hover:text-orange-500"
        >
          Streakr
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-zinc-300 md:flex">
          <Link href="/picks" className="hover:text-white">Picks</Link>
          <Link href="/leaderboard" className="hover:text-white">Leaderboard</Link>
          <Link href="/how-to-play" className="hover:text-white">How to Play</Link>
          <Link href="/rewards" className="hover:text-white">Rewards</Link>
          {isAuthorizedAdmin && (
             <Link href="/admin" className="hover:text-white">Admin</Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
              >
                Account
              </button>
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 py-2 shadow-lg">
                    <Link href="/profile" className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700">Profile</Link>
                    <button
                        onClick={() => {
                        auth.signOut();
                        setIsAccountMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
                    >
                        Sign Out
                    </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
