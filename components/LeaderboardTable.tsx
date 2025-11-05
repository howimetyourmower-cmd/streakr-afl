
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const LeaderboardTable = ({ leaders }: { leaders: any[] }) => {
  if (leaders.length === 0) {
    return <p>No leaderboard data available yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Streak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaders.map((leader, index) => (
          <TableRow key={leader.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{leader.name}</TableCell>
            <TableCell>{leader.streak}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
