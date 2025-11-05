
import { PageHeader } from "@/components/PageHeader";

const RewardCard = ({ title, description, eligibility, prize }: { title: string; description: string; eligibility: string; prize: string; }) => (
  <div className="rounded-lg border bg-gray-800 p-6">
    <h2 className="text-2xl font-bold">{title}</h2>
    <p className="mt-2 text-gray-400">{description}</p>
    <div className="mt-4">
      <p><strong>Eligibility:</strong> {eligibility}</p>
      <p><strong>Prize:</strong> <span className="font-bold text-orange-500">{prize}</span></p>
    </div>
  </div>
);

export default function RewardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Rewards" subtitle="Win big with your AFL knowledge" />
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <RewardCard
          title="Round Winner"
          description="Finish the round with the longest streak to be crowned the Round Winner."
          eligibility="Longest streak for the round"
          prize="$50 Gift Card"
        />
        <RewardCard
          title="Season Champion"
          description="The ultimate prize for the most consistent tipster throughout the season."
          eligibility="Longest cumulative streak for the season"
          prize="$500 Grand Prize"
        />
        <RewardCard
          title="Perfect Round Bonus"
          description="Correctly pick every question in a single round."
          eligibility="100% accuracy in one round"
          prize="Exclusive Streakr Merchandise"
        />
        <RewardCard
          title="Top 10 Finisher"
          description="Consistently perform and finish in the top 10 of the season leaderboard."
          eligibility="Top 10 on the season leaderboard"
          prize="Entry into a draw for a team jersey"
        />
      </div>
    </div>
  );
}
