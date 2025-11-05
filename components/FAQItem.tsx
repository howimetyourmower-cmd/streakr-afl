`use client`;
import React, { useState } from 'react';

type FAQItemProps = {
  faq: { question: string; answer: string };
};

const FAQItem = ({ faq }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-700 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-6 px-2"
      >
        <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
        <svg
          className={`w-5 h-5 text-zinc-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-6 px-2 text-zinc-300">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
