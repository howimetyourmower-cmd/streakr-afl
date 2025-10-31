export default function LeaderboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      <p className="opacity-80">Public leaderboard coming soon. (Visible to guests and signed-in users.)</p>
      <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
        <div className="opacity-60 text-sm">Example</div>
        <ul className="mt-2 space-y-2">
          <li>#1 DemoUser — Streak: 7</li>
          <li>#2 SampleUser — Streak: 6</li>
        </ul>
      </div>
    </div>
  );
}