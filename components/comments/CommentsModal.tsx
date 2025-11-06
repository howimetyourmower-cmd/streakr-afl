import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import SignInModal from '@/components/auth/SignInModal';
import { db } from '@/src/lib/firebaseClient';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface Comment {
  id: string;
  userId: string;
  displayName: string;
  text: string;
  createdAt: any;
}

interface CommentsModalProps {
  questionId: string;
  onClose: () => void;
}

export default function CommentsModal({ questionId, onClose }: CommentsModalProps) {
  const { user } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, `questions/${questionId}/comments`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
      setComments(commentsData);
    });
    return () => unsubscribe();
  }, [questionId]);

  const handlePostComment = async () => {
    if (!user) {
      setShowSignInModal(true);
      return;
    }

    if (newComment.trim().length < 1 || newComment.trim().length > 400) {
      setError('Comment must be between 1 and 400 characters.');
      return;
    }

    try {
      await addDoc(collection(db, `questions/${questionId}/comments`), {
        userId: user.uid,
        displayName: user.displayName || 'Anonymous',
        text: newComment,
        createdAt: serverTimestamp(),
        status: 'ok',
      });
      setNewComment('');
      setError('');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {comments.map(comment => (
            <div key={comment.id} className="border-b pb-2">
              <p className="font-semibold">{comment.displayName}</p>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? 'Add a comment...' : 'Sign in to add a comment...'}
            disabled={!user}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end mt-2">
            <button onClick={onClose} className="mr-2 px-4 py-2 rounded">Cancel</button>
            <button onClick={handlePostComment} className="px-4 py-2 bg-orange-500 text-white rounded">Post</button>
          </div>
        </div>
      </div>
      {showSignInModal && <SignInModal open={showSignInModal} onClose={() => setShowSignInModal(false)} />}
    </div>
  );
}
