"use client";

import * as React from "react";
import { useDerivSession } from "./session-context";
import type { DigitStat } from "@/components/digit/digit-grid";

const WINDOW_SIZE = 500;

function lastDigit(price: number, pipSize: number): number {
  const str = price.toFixed(pipSize);
  return Number(str[str.length - 1]);
}

export function useDigitStats(symbol: string | null) {
  const { socket, state } = useDerivSession();
  const [digits, setDigits] = React.useState<number[]>([]);
  const [activeDigit, setActiveDigit] = React.useState<number | null>(null);
  const [lastPrice, setLastPrice] = React.useState<number | null>(null);
  const subscriptionIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!socket || !symbol || state !== "open") return;

    let cancelled = false;
    const off = socket.on("tick", (msg) => {
      if (cancelled || msg.tick?.symbol !== symbol) return;
      const pipSize = msg.tick.pip_size ?? 2;
      const digit = lastDigit(msg.tick.quote, pipSize);
      setLastPrice(msg.tick.quote);
      setActiveDigit(digit);
      setDigits((prev) => {
        const next = [...prev, digit];
        return next.length > WINDOW_SIZE ? next.slice(next.length - WINDOW_SIZE) : next;
      });
    });

    socket
      .subscribeTicks(symbol)
      .then((res) => {
        if (res.subscription?.id) subscriptionIdRef.current = res.subscription.id;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      off();
      if (subscriptionIdRef.current) socket.forget(subscriptionIdRef.current).catch(() => {});
      subscriptionIdRef.current = null;
    };
  }, [socket, symbol, state]);

  const stats: DigitStat[] = React.useMemo(() => {
    const counts = new Array(10).fill(0);
    digits.forEach((d) => counts[d]++);
    const total = digits.length;
    const expected = total > 0 ? total / 10 : 0;

    // Current streak per digit: consecutive occurrences at the tail.
    const streaks = new Array(10).fill(0);
    if (digits.length > 0) {
      const tailDigit = digits[digits.length - 1];
      let i = digits.length - 1;
      let streak = 0;
      while (i >= 0 && digits[i] === tailDigit) {
        streak++;
        i--;
      }
      streaks[tailDigit] = streak;
    }

    return Array.from({ length: 10 }, (_, digit) => {
      const count = counts[digit];
      const frequency = total > 0 ? (count / total) * 100 : 0;
      return {
        digit,
        count,
        frequency,
        streak: streaks[digit],
        isHot: total >= 30 && count > expected * 1.15,
        isCold: total >= 30 && count < expected * 0.85,
      };
    });
  }, [digits]);

  return { stats, activeDigit, lastPrice, sampleSize: digits.length };
}
