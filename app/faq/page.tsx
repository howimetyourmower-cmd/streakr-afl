export default function FAQPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">FAQ</h1>
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
          <div className="font-semibold">How do I win?</div>
          <p className="opacity-80">Build the longest correct streak for the round.</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
          <div className="font-semibold">Can I restart my streak?</div>
          <p className="opacity-80">Yes—your current streak ends and a new one begins.</p>
        </div>
      </div>
    </div>
  );
}