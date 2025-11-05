'use client';

import { useState } from 'react';

export default function SettlePage() {
  const [round, setRound] = useState('1');
  const [gameIndex, setGameIndex] = useState('0');
  const [questionIndex, setQuestionIndex] = useState('0');
  const [result, setResult] = useState('YES');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/settle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          roundId: `round-${round}`,
          gameIndex: parseInt(gameIndex),
          questionIndex: parseInt(questionIndex),
          result,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: 'An unknown error occurred' });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-900 text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Settle Round</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="round" className="block mb-1">Round</label>
          <input
            id="round"
            type="text"
            value={round}
            onChange={(e) => setRound(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="gameIndex" className="block mb-1">Game Index</label>
          <input
            id="gameIndex"
            type="text"
            value={gameIndex}
            onChange={(e) => setGameIndex(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="questionIndex" className="block mb-1">Question Index</label>
          <input
            id="questionIndex"
            type="text"
            value={questionIndex}
            onChange={(e) => setQuestionIndex(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="result" className="block mb-1">Result</label>
          <select
            id="result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
          >
            <option value="YES">YES</option>
            <option value="NO">NO</option>
            <option value="VOID">VOID</option>
          </select>
        </div>
        <div>
          <label htmlFor="adminKey" className="block mb-1">Admin Key</label>
          <input
            id="adminKey"
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Settling...' : 'Settle Question'}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h2 className="font-bold">Response:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
