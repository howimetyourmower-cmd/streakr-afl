
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const SettlementRow = ({ pick, onSettle }: any) => {
  const [isSettling, setIsSettling] = useState(false);

  const handleSettle = async (result: "yes" | "no" | "void" | "regrade") => {
    setIsSettling(true);
    await onSettle(pick.id, result);
    setIsSettling(false);
  };

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <p className="font-semibold">{pick.question}</p>
      <p className="text-sm text-gray-400">{pick.match}</p>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button size="sm" onClick={() => handleSettle("yes")} disabled={isSettling} variant="outline">Yes</Button>
        <Button size="sm" onClick={() => handleSettle("no")} disabled={isSettling} variant="outline">No</Button>
        <Button size="sm" onClick={() => handleSettle("void")} disabled={isSettling} variant="destructive">Void</Button>
        <Button size="sm" onClick={() => handleSettle("regrade")} disabled={isSettling} variant="secondary">Regrade</Button>
      </div>
    </div>
  );
};
