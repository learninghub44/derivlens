"use client";

import * as React from "react";
import { clsx } from "clsx";

export type DigitAnimationState = "idle" | "tick" | "match";

export interface DigitCircleProps {
  digit: number; // 0-9
  frequency: number; // 0-100 (%)
  count: number;
  isActive?: boolean; // this digit is the most recent tick
  isSelected?: boolean; // user has selected this digit for analysis
  isHot?: boolean; // above expected frequency
  isCold?: boolean; // below expected frequency / overdue
  streak?: number; // consecutive appearances right now
  animationState?: DigitAnimationState;
  onClick?: (digit: number) => void;
  className?: string;
}

/**
 * A single digit, always rendered centered inside its own circular
 * element (spec section 63/66). The ring around the circle encodes
 * live frequency as a conic-gradient sweep — never overcrowds the
 * circle itself; frequency % and appearance count render below it.
 */
export function DigitCircle({
  digit,
  frequency,
  count,
  isActive = false,
  isSelected = false,
  isHot = false,
  isCold = false,
  streak = 0,
  animationState = "idle",
  onClick,
  className,
}: DigitCircleProps) {
  const pct = Math.max(0, Math.min(100, frequency));
  const ringColor = isHot
    ? "rgb(var(--signal))"
    : isCold
      ? "rgb(var(--amber))"
      : "rgb(var(--signal) / 0.55)";

  return (
    <button
      type="button"
      onClick={() => onClick?.(digit)}
      aria-pressed={isSelected}
      aria-label={`Digit ${digit}, ${pct.toFixed(1)} percent, ${count} appearances${
        isActive ? ", live" : ""
      }`}
      className={clsx(
        "group flex flex-col items-center gap-1.5 rounded-lg p-2 outline-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal",
        className,
      )}
    >
      {isActive && (
        <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-signal">
          Live
        </span>
      )}
      <span
        className={clsx(
          "relative flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-150",
          isActive && "animate-pulse-ring",
          "motion-reduce:animate-none",
        )}
        style={{
          background: `conic-gradient(${ringColor} ${pct * 3.6}deg, rgb(var(--line)) 0deg)`,
          padding: 3,
        }}
      >
        <span
          className={clsx(
            "flex h-full w-full items-center justify-center rounded-full border transition-colors duration-150",
            isSelected
              ? "border-signal bg-signal/10"
              : "border-line bg-surface group-hover:border-text-muted",
            isActive && "ring-2 ring-signal/40",
          )}
        >
          <span className="font-mono text-lg font-semibold tabular-nums text-text-primary">
            {digit}
          </span>
        </span>
      </span>
      <span className="flex flex-col items-center leading-tight">
        <span className="font-mono text-[11px] tabular-nums text-text-muted">
          {pct.toFixed(1)}%
        </span>
        <span className="font-mono text-[10px] tabular-nums text-text-muted/70">
          {count} seen
        </span>
      </span>
      {streak > 1 && (
        <span className="font-mono text-[10px] tabular-nums text-amber">×{streak}</span>
      )}
    </button>
  );
}
