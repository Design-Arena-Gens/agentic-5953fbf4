'use client';

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  change?: {
    label: string;
    positive?: boolean;
  };
  icon?: ReactNode;
  accent?: "emerald" | "sky" | "violet" | "amber" | "rose";
  className?: string;
};

const accentMap = {
  emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  sky: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  violet: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-600 border-rose-500/20",
} as const;

export function StatCard({
  label,
  value,
  change,
  icon,
  accent = "emerald",
  className,
}: StatCardProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                accentMap[accent],
                change.positive === false && "text-rose-600 bg-rose-50",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  change.positive === false ? "bg-rose-500" : "bg-current",
                )}
              />
              {change.label}
            </p>
          )}
        </div>
        {icon && (
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border",
              accentMap[accent],
            )}
          >
            {icon}
          </span>
        )}
      </div>
    </article>
  );
}
