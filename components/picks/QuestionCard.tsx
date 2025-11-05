'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebaseClient';
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PublicQuestion, getRoundQuestions } from '@/lib/fixtures';
import StatusBadge from './StatusBadge';
import SignInModal from '../auth/SignInModal';

// Placeholder functions. In a real application, these would have more robust logic.
const saveUserPick = async (questionId: string, userId: string, choice: 'yes' | 'no') => {
  await addDoc(collection(db, 'picks'), { questionId, userId, choice, createdAt: serverTimestamp() });
};

const getYesNoPercent = (yes: number, no: number) => {
  const total = yes + no;
  if (total === 0) return { yes: 0, no: 0 };
  return {
    yes: Math.round((yes / total) * 100),
    no: Math.round((no / total) * 100),
  };
};

interface QuestionCardProps {
  question: PublicQuestion;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { user } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [liveQuestion, setLiveQuestion] = useState(question);
  const [selectedChoice, setSelectedChoice] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "fixtures", `round-${question.roundId}`, "games", question.gameId, "questions", question.id), (doc) => {
      const data = doc.data() as any;
      setLiveQuestion(prev => ({ ...prev, ...data }));
    });
    return () => unsub();
  }, [question.id, question.roundId, question.gameId]);

  const handlePick = async (choice: 'yes' | 'no') => {
    if (!user) {
      setSelectedChoice(choice);
      setShowSignInModal(true);
      return;
    }
    try {
      await saveUserPick(liveQuestion.id, user.uid, choice);
      // Optimistically update the UI
      const newTotals = { 
        yes: (liveQuestion.totals?.yes || 0) + (choice === 'yes' ? 1 : 0),
        no: (liveQuestion.totals?.no || 0) + (choice === 'no' ? 1 : 0),
       };
      setLiveQuestion(prev => ({ ...prev, totals: newTotals }));

    } catch (error) {
      console.error('Error saving pick: ', error);
    }
  };

  useEffect(() => {
    if(user && selectedChoice) {
      handlePick(selectedChoice)
      setSelectedChoice(null)
    }
  }, [user, selectedChoice])

  const { yes, no } = getYesNoPercent(liveQuestion.totals?.yes || 0, liveQuestion.totals?.no || 0);

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white/5">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{liveQuestion.text}</p>
          <p className="text-sm text-gray-400">Q{liveQuestion.quarter}</p>
        </div>
        <StatusBadge status={liveQuestion.status} />
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={() => handlePick('yes')}
          disabled={liveQuestion.status !== 'open'}
          className="px-4 py-2 rounded bg-green-500 text-white disabled:bg-gray-400"
        >
          Yes
        </button>
        <button
          onClick={() => handlePick('no')}
          disabled={liveQuestion.status !== 'open'}
          className="px-4 py-2 rounded bg-red-500 text-white disabled:bg-gray-400"
        >
          No
        </button>
      </div>
      <div className="mt-2 text-center text-sm text-gray-400">
        {!user && <p>Sign in to make your pick.</p>}
      </div>
      <div className="mt-4 flex justify-around">
        <div className="text-center">
          <p className="font-bold">{yes}%</p>
          <p className="text-xs">Yes ({liveQuestion.totals?.yes || 0})</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{no}%</p>
          <p className="text-xs">No ({liveQuestion.totals?.no || 0})</p>
        </div>
      </div>
      {showSignInModal && <SignInModal open={showSignInModal} onClose={() => setShowSignInModal(false)} />}
    </div>
  );
}
