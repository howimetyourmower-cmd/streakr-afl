
import { PageHeader } from "@/components/PageHeader";

const HowToPlayItem = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="mb-2 text-2xl font-bold">{title}</h2>
    <div className="text-gray-400">{children}</div>
  </div>
);

export default function HowToPlayPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="How to Play" subtitle="Your guide to becoming a Streakr champion" />
      <div className="max-w-3xl mx-auto">
        <HowToPlayItem title="1. Make Your Picks">
          <p>Each round, a set of questions about AFL matches will be available. Your task is to predict the outcome for each question. Simply select "Yes" or "No" for each pick.</p>
        </HowToPlayItem>
        <HowToPlayItem title="2. Build Your Streak">
          <p>For every correct pick you make, your streak increases by one. The goal is to build the longest possible streak of correct predictions.</p>
        </HowToPlayItem>
        <HowToPlayItem title="3. Keep Your Streak Alive">
          <p>If you make an incorrect pick, your streak resets to zero. But don't worry, you can start a new streak with the very next question.</p>
        </HowToPlayItem>
        <HowToPlayItem title="4. Locking Time">
          <p>Picks for a specific question lock at the scheduled start time of the corresponding match. Make sure to get your picks in before then!</p>
        </HowToPlayItem>
        <HowToPlayItem title="5. Win Prizes">
          <p>The players with the longest streaks at the end of each round and at the end of the season will win prizes. Check the Rewards page for more details on what you can win.</p>
        </HowToPlayItem>
      </div>
    </div>
  );
}
