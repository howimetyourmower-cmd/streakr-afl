
"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeaderboardPage() {
  const [data, setData] = useState<{ round: any; season: any } | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/leaderboard");
      const json = await res.json();
      setData(json);
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Leaderboard" subtitle="See who's leading the pack" />

      {!data && <p>Loading leaderboards...</p>}
      {data && (
        <Tabs defaultValue="round">
          <TabsList className="mb-4">
            <TabsTrigger value="round">Current Round</TabsTrigger>
            <TabsTrigger value="season">Season-Long</TabsTrigger>
          </TabsList>
          <TabsContent value="round">
            <LeaderboardTable leaders={data.round} />
          </TabsContent>
          <TabsContent value="season">
            <LeaderboardTable leaders={data.season} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
