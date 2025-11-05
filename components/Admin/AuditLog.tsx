
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const AuditLog = ({ logs }: { logs: any[] }) => {
  if (logs.length === 0) {
    return <p>No audit log entries found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pick ID</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Settled At</TableHead>
          <TableHead>Settled By</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="truncate font-mono text-xs">{log.pickId}</TableCell>
            <TableCell>{log.result}</TableCell>
            <TableCell>{new Date(log.settledAt.seconds * 1000).toLocaleString()}</TableCell>
            <TableCell>{log.settledBy}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
