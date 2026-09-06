"use client";

import { BottomSheet } from "@/components/BottomSheet";
import { PLAYERS } from "@/lib/constants";

type Props = {
  open: boolean;
  value: string;
  excluded?: string;
  onClose: () => void;
  onSelect: (name: string) => void;
};

export function PlayerPicker({
  open,
  value,
  excluded,
  onClose,
  onSelect,
}: Props) {
  return (
    <BottomSheet open={open} title="Select Player" onClose={onClose}>
      <div className="space-y-2">
        {PLAYERS.map((name) => {
          const disabled = excluded?.toLowerCase() === name.toLowerCase();
          const selected = value.toLowerCase() === name.toLowerCase();
          return (
            <button
              key={name}
              type="button"
              disabled={disabled}
              onClick={() => {
                onSelect(name);
                onClose();
              }}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-4 text-left text-lg font-bold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-30 ${
                selected
                  ? "bg-[var(--gold)] text-black"
                  : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <span className="uppercase">{name}</span>
              {disabled ? (
                <span className="text-xs font-medium opacity-70">In use</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
