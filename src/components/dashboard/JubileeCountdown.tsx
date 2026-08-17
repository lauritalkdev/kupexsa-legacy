"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(): TimeLeft {
  const targetDate = new Date("2027-10-29T00:00:00+01:00").getTime();
  const now = Date.now();
  const difference = Math.max(targetDate - now, 0);

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    ),
    minutes: Math.floor(
      (difference / (1000 * 60)) % 60
    ),
    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

export default function JubileeCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft()
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-700">
        Countdown to 29 October 2027
      </p>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
        {[
          ["Days", timeLeft.days],
          ["Hours", timeLeft.hours],
          ["Minutes", timeLeft.minutes],
          ["Seconds", timeLeft.seconds],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-xl bg-blue-950 px-2 py-4 text-center text-white"
          >
            <p className="text-xl font-bold sm:text-2xl">
              {String(value)}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-wide text-blue-200 sm:text-xs">
              {String(label)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}