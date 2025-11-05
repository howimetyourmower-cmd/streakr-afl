
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";

const FAQItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => (
  <div>
    <h2 className="text-xl font-bold">{question}</h2>
    <div className="mt-2 text-gray-400">{answer}</div>
  </div>
);

export default function FAQPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (response.ok) {
        setFormState("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setFormState("error");
      }
    } catch (error) {
      setFormState("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Frequently Asked Questions" />
      <div className="space-y-8">
        <FAQItem
          question="How to play"
          answer="Make one pick per question to build your streak. Keep your streak alive to win!"
        />
        <FAQItem
          question="When do questions lock?"
          answer="Questions lock at the scheduled start time of the match."
        />
        <FAQItem
          question="What if a match is abandoned or unclear?"
          answer="If a match is abandoned or the outcome is unclear, the question may be voided, and your streak will be unaffected."
        />
        <FAQItem
          question="Ties / regrades"
          answer="In case of a tie, the prize pool is split. Admins may regrade a question if an error is made. The longest unbroken streak wins any tiebreaker."
        />
        <FAQItem
          question="Age requirement"
          answer="You must be 18 years or older to play."
        />
      </div>
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <form onSubmit={handleSubmit} className="mt-4 max-w-lg space-y-4">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button type="submit" disabled={formState === "loading"}>
            {formState === "loading" ? "Sending..." : "Send Message"}
          </Button>
          {formState === "success" && <p className="text-green-500">Message sent successfully!</p>}
          {formState === "error" && <p className="text-red-500">Failed to send message. Please try again later.</p>}
        </form>
      </div>
    </div>
  );
}
