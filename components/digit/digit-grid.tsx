"use client";

import * as React from "react";
import { DigitCircle, type DigitAnimationState } from "./digit-circle";

export interface DigitStat {
  digit: number;
  frequency: number;
  count: number;
  streak: number;
  isHot: boolean;
  isCold: boolean;
}

export interface DigitGridProps {
  stats: DigitStat[]; // exactly 10 entries, index-independent (matched by .digit)
  activeDigit?: number | null;
  selectedDigits?: number[];
  animationState?: DigitAnimationState;
  onSelectDigit?: (digit: number) => void;
}

const ROWS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9],
];

export function DigitGrid({
  stats,
  activeDigit,
  selectedDigits = [],
  animationState = "idle",
  onSelectDigit,
}: DigitGridProps) {
  const byDigit = React.useMemo(() => {
    const m = new Map<number, DigitStat>();
    stats.forEach((s) => m.set(s.digit, s));
    return m;
  }, [stats]);

  return (
    <div className="flex flex-col items-center gap-2" role="group" aria-label="Digit distribution">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((d) => {
            const s = byDigit.get(d);
            return (
              <DigitCircle
                key={d}
                digit={d}
                frequency={s?.frequency ?? 0}
                count={s?.count ?? 0}
                streak={s?.streak ?? 0}
                isHot={s?.isHot ?? false}
                isCold={s?.isCold ?? false}
                isActive={activeDigit === d}
                isSelected={selectedDigits.includes(d)}
                animationState={activeDigit === d ? animationState : "idle"}
                onClick={onSelectDigit}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
