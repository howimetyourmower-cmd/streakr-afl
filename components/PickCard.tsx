
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PickCard = ({ pick, isLoggedIn }: { pick: any; isLoggedIn: boolean }) => {
  return (
    <div className="rounded-lg border bg-gray-800 p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">{pick.match}</div>
        <div className="text-sm text-gray-400">{pick.quarter}</div>
      </div>
      <p className="mb-4 text-lg font-semibold">{pick.question}</p>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${pick.status === "open" ? "text-green-500" : "text-yellow-500"}`}>
          {pick.status.toUpperCase()}
        </span>
        {isLoggedIn ? (
          <Link href={`/picks#${pick.id}`}>
            <Button size="sm">Make Pick</Button>
          </Link>
        ) : (
          <Link href="/auth/signin">
            <Button size="sm">Sign In to Pick</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PickCard;
