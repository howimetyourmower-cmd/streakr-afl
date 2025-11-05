
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveUserPick } from "@/lib/fixtures";

export const PickRow = ({ pick, userPick, onSave, isLocked, isSettled, result }: any) => {
  const [selected, setSelected] = useState<"yes" | "no" | null>(userPick?.choice || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      await onSave(pick.id, selected);
    } finally {
      setIsSaving(false);
    }
  };

  const pickStatus = isSettled
    ? `Settled: ${result}`
    : isLocked
    ? "Locked"
    : "Open";

  return (
    <div className="grid grid-cols-4 items-center gap-4 rounded-lg bg-gray-800 p-4">
      <div className="col-span-2">
        <p className="font-semibold">{pick.question}</p>
        <p className="text-sm text-gray-400">{pick.match}</p>
      </div>
      <div className="col-span-1 flex items-center justify-center gap-2">
        <Button
          variant={selected === "yes" ? "default" : "outline"}
          onClick={() => setSelected("yes")}
          disabled={isLocked || isSettled}
          className="w-16"
        >
          Yes
        </Button>
        <Button
          variant={selected === "no" ? "default" : "outline"}
          onClick={() => setSelected("no")}
          disabled={isLocked || isSettled}
          className="w-16"
        >
          No
        </Button>
      </div>
      <div className="col-span-1 flex items-center justify-end gap-2">
        <span className="text-sm text-gray-400">{pickStatus}</span>
        <Button onClick={handleSave} disabled={isSaving || isLocked || isSettled || !selected}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};
