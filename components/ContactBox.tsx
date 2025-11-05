`use client`;

import { useState } from 'react';

const ContactBox = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!response.ok) throw new Error('Failed to submit');
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

  return (
    <div className="mt-12 p-8 bg-zinc-800 rounded-2xl border border-zinc-700">
      <h2 className="text-2xl font-bold text-white">Contact Us</h2>
      <p className="text-zinc-400 mt-2">Have a question or feedback? Drop us a line.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-500"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'success' && <p className="text-green-400">Message sent successfully!</p>}
        {status === 'error' && <p className="text-red-400">Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
};

export default ContactBox;
