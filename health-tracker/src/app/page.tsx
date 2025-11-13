'use client';

import { useMemo } from "react";
import { Flame, HeartPulse, Moon, Scale, Trophy } from "lucide-react";
import {
  format,
  formatDistanceToNow,
  parseISO,
  subDays,
} from "date-fns";
import { HealthForm, WeightForm, WorkoutForm } from "@/components/forms";
import { StatCard } from "@/components/stat-card";
import { TrendChart } from "@/components/trend-chart";
import { LogTable } from "@/components/log-table";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { DashboardState, HealthEntry, WeightEntry, WorkoutEntry } from "@/lib/types";

const STORAGE_KEY = "vitaltrack-dashboard";

const defaultState: DashboardState = {
  health: [],
  workouts: [],
  weight: [],
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sortByDate<T extends { date: string }>(entries: T[]) {
  return [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export default function Home() {
  const [state, setState, hydrated] = useLocalStorageState<DashboardState>(
    STORAGE_KEY,
    defaultState,
  );

  const weekWindow = useMemo(() => subDays(new Date(), 6), []);

  const recentHealth = useMemo(
    () =>
      sortByDate(state.health).filter(
        (entry) => new Date(entry.date) >= weekWindow,
      ),
    [state.health, weekWindow],
  );

  const recentWorkouts = useMemo(
    () =>
      sortByDate(state.workouts).filter(
        (entry) => new Date(entry.date) >= weekWindow,
      ),
    [state.workouts, weekWindow],
  );

  const recentWeight = useMemo(
    () => sortByDate(state.weight).slice(0, 14),
    [state.weight],
  );

  const latestHealth = recentHealth[0];
  const latestWeight = sortByDate(state.weight)[0];

  const averageSleep =
    recentHealth.reduce((total, entry) => total + entry.sleepHours, 0) /
      Math.max(recentHealth.length, 1) || 0;

  const averageWater =
    recentHealth.reduce((total, entry) => total + entry.waterLiters, 0) /
      Math.max(recentHealth.length, 1) || 0;

  const totalCalories =
    recentHealth.reduce((total, entry) => total + entry.calories, 0) || 0;

  const lastWeightChange = (() => {
    if (recentWeight.length < 2) return null;
    const [latest, ...rest] = recentWeight;
    const previous = rest[0];
    const delta = latest.weightKg - previous.weightKg;
    return { delta, previous, latest };
  })();

  const handleAddHealth = (payload: Omit<HealthEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      health: sortByDate([
        ...prev.health,
        {
          ...payload,
          id: createId(),
        },
      ]),
    }));
  };

  const handleAddWorkout = (payload: Omit<WorkoutEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      workouts: sortByDate([
        ...prev.workouts,
        {
          ...payload,
          id: createId(),
        },
      ]),
    }));
  };

  const handleAddWeight = (payload: Omit<WeightEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      weight: sortByDate([
        ...prev.weight,
        {
          ...payload,
          id: createId(),
        },
      ]),
    }));
  };

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-100 via-slate-100 to-sky-100">
        <div className="rounded-2xl bg-white px-10 py-8 text-center shadow-lg">
          <p className="text-sm font-medium text-slate-600">
            Loading your VitalTrack data…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100/40 via-slate-100 to-sky-100/40 pb-16">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-16 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-white/95 px-8 py-10 shadow-xl shadow-emerald-500/5 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-500">
                VitalTrack
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-900">
                Your Health & Training Command Center
              </h1>
              <p className="mt-4 max-w-xl text-sm text-slate-600">
                See the key inputs that drive your energy, track structured
                workouts, and stay accountable to your body composition goals—
                all in one forward-looking dashboard.
              </p>
            </div>
            {latestHealth ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-700 shadow-inner">
                <p className="text-xs uppercase tracking-wide text-emerald-600">
                  Last check-in
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatDistanceToNow(parseISO(latestHealth.date), {
                    addSuffix: true,
                  })}
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  Mood: {latestHealth.mood}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-8 text-center text-sm text-emerald-700">
                Log your first check-in to unlock insights.
              </div>
            )}
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Average Sleep (7d)"
            value={`${averageSleep.toFixed(1)} hrs`}
            change={
              latestHealth && {
                label: `Last night ${latestHealth.sleepHours} hrs`,
                positive: latestHealth.sleepHours >= 7,
              }
            }
            icon={<Moon className="h-6 w-6" />}
            accent="emerald"
          />
          <StatCard
            label="Hydration (7d avg)"
            value={`${averageWater.toFixed(1)} L`}
            change={
              latestHealth && {
                label: `Yesterday ${latestHealth.waterLiters} L`,
                positive: latestHealth.waterLiters >= 2,
              }
            }
            icon={<HeartPulse className="h-6 w-6" />}
            accent="sky"
          />
          <StatCard
            label="Workouts Completed"
            value={`${recentWorkouts.length} / 7 days`}
            change={
              recentWorkouts[0] && {
                label: `Last: ${format(
                  parseISO(recentWorkouts[0].date),
                  "MMM d",
                )}`,
                positive: true,
              }
            }
            icon={<Trophy className="h-6 w-6" />}
            accent="violet"
          />
          <StatCard
            label="Weight Change"
            value={
              latestWeight
                ? `${latestWeight.weightKg.toFixed(1)} kg`
                : "Add weight log"
            }
            change={
              lastWeightChange
                ? {
                    label: `${lastWeightChange.delta >= 0 ? "+" : ""}${lastWeightChange.delta.toFixed(1)} kg vs ${format(
                      parseISO(lastWeightChange.previous.date),
                      "MMM d",
                    )}`,
                    positive: lastWeightChange.delta <= 0,
                  }
                : undefined
            }
            icon={<Scale className="h-6 w-6" />}
            accent="amber"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <TrendChart
            title="Weight trajectory"
            data={sortByDate(state.weight)
              .slice()
              .reverse()
              .map((entry) => ({
                date: entry.date,
                value: Number(entry.weightKg.toFixed(1)),
              }))}
            unit="kg"
          />
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Weekly focus
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3 rounded-xl bg-emerald-500/10 p-3 font-medium text-emerald-700">
                <Flame className="h-5 w-5 shrink-0 text-emerald-500" />
                Fuel consistency: target{" "}
                {Math.round(
                  totalCalories / Math.max(recentHealth.length || 1, 1),
                )}{" "}
                kcal daily average.
              </li>
              <li className="flex gap-3 rounded-xl bg-slate-50 p-3">
                <HeartPulse className="h-5 w-5 shrink-0 text-violet-500" />
                Commit to{" "}
                <span className="font-semibold text-slate-800">
                  {Math.max(4, recentWorkouts.length)}
                </span>{" "}
                sessions. Add deload notes when intensity is &quot;high&quot;.
              </li>
              <li className="flex gap-3 rounded-xl bg-slate-50 p-3">
                <Moon className="h-5 w-5 shrink-0 text-sky-500" />
                Prioritize sleep before heavy training days to keep the
                readiness score green.
              </li>
            </ul>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
          <HealthForm onSubmit={handleAddHealth} />
          <WorkoutForm onSubmit={handleAddWorkout} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <LogTable
            title="Recent health log"
            description="Sleep, hydration, and fuel data for the past two weeks."
            columns={[
              {
                key: "date",
                label: "Date",
                format: (value) =>
                  format(parseISO(value as string), "EEE • MMM d"),
              },
              {
                key: "sleepHours",
                label: "Sleep",
                format: (value) => `${(value as number).toFixed(1)} h`,
              },
              {
                key: "waterLiters",
                label: "Water",
                format: (value) => `${(value as number).toFixed(1)} L`,
              },
              {
                key: "calories",
                label: "Calories",
                format: (value) => `${value} kcal`,
              },
              {
                key: "mood",
                label: "Mood",
                format: (value) => (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                    {value as string}
                  </span>
                ),
              },
            ]}
            rows={sortByDate(state.health).slice(0, 8)}
            empty="No daily check-ins yet. Log your first entry to see it here."
          />
          <WeightForm onSubmit={handleAddWeight} />
        </section>

        <LogTable
          title="Training sessions"
          description="Load management and intensity notes keep you from overreaching."
          columns={[
            {
              key: "date",
              label: "Date",
              format: (value) =>
                format(parseISO(value as string), "MMM d, yyyy"),
            },
            {
              key: "type",
              label: "Session",
            },
            {
              key: "durationMinutes",
              label: "Duration",
              format: (value) => `${value} min`,
              align: "center",
            },
            {
              key: "intensity",
              label: "Intensity",
              format: (value) => (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {value as string}
                </span>
              ),
              align: "center",
            },
            {
              key: "caloriesBurned",
              label: "Calories",
              format: (value) => `${value} kcal`,
              align: "right",
            },
          ]}
          rows={sortByDate(state.workouts).slice(0, 12)}
          empty="No workouts logged. Add your training sessions above."
        />
      </section>
    </main>
  );
}
