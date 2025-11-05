
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import SignInModal from '@/components/auth/SignInModal';
import HeroSection from '@/components/HeroSection';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import StatusBadge from '@/components/picks/StatusBadge';

// Main Home Page Component
export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<any[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Data fetching and error handling
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/questions', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch questions');
        }
        const { questions } = await res.json();
        setQuestions(questions || []);
      } catch (e: any) {
        console.error('Upcoming questions load error:', e);
        const message = e?.message || 'Failed to load upcoming questions.';
        if (message.includes('requires an index')) {
          const urlMatch = message.match(/https?:\/\/[^\s]+/);
          if (urlMatch) {
            setErr(`Firestore needs a compound index. Please create it by visiting this URL: ${urlMatch[0]}`);
            return;
          }
        }
        setErr('Failed to load upcoming questions.');
      }
    };
    fetchQuestions();
  }, []);

  const isLoading = authLoading || questions === null;

  return (
    <>
      <HeroSection />

      <section id="picks" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Upcoming Picks</h2>
          <p className="mt-2 text-white/70">Make your selections for the upcoming rounds.</p>
        </div>

        {isLoading && !err && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        )}

        {err && <div className="mt-8 text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{err}</div>}

        {!isLoading && !err && questions && questions.length === 0 && (
          <div className="mt-8 text-center text-white/50">No picks available yet.</div>
        )}

        {!isLoading && !err && questions && questions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {questions.map(question => (
              <div key={question.id} className="bg-white/5 rounded-xl border border-white/10 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{question.match}</p>
                    <StatusBadge status={question.status} />
                  </div>
                  <p className="text-sm text-gray-400">Q{question.quarter}</p>
                  <p className="mt-3 font-bold text-lg">{question.text}</p>
                </div>
                <div className="mt-5">
                  <Link href="/picks">
                    <button
                      disabled={question.status === 'final'}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold transition bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      Make This Pick
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <SignInModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
