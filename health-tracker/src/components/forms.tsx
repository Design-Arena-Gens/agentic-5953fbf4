'use client';

import { FormEvent, useMemo, useState } from "react";
import { HealthEntry, WorkoutEntry, WeightEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

type BaseFormProps<T> = {
  onSubmit: (payload: Omit<T, "id">) => void;
};

export function HealthForm({ onSubmit }: BaseFormProps<HealthEntry>) {
  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    [],
  );
  const [form, setForm] = useState({
    date: today,
    sleepHours: 7,
    waterLiters: 2.5,
    calories: 2100,
    mood: "steady" as HealthEntry["mood"],
    notes: "",
  });

  const handleChange = (
    field: keyof typeof form,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      sleepHours: Number(form.sleepHours),
      waterLiters: Number(form.waterLiters),
      calories: Number(form.calories),
      notes: form.notes.trim() || undefined,
    });
    setForm((prev) => ({
      ...prev,
      notes: "",
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <header className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-slate-900">
          Daily Health Check-in
        </h3>
        <p className="text-sm text-slate-500">
          Track your core wellness inputs to keep your routines steady.
        </p>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="health-date" className="text-sm font-medium text-slate-600">
            Date
          </label>
          <input
            id="health-date"
            type="date"
            value={form.date}
            onChange={(event) => handleChange("date", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="sleep-hours" className="text-sm font-medium text-slate-600">
            Sleep (hrs)
          </label>
          <input
            id="sleep-hours"
            type="number"
            min={0}
            step={0.5}
            value={form.sleepHours}
            onChange={(event) => handleChange("sleepHours", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="water-liters" className="text-sm font-medium text-slate-600">
            Water (L)
          </label>
          <input
            id="water-liters"
            type="number"
            min={0}
            step={0.1}
            value={form.waterLiters}
            onChange={(event) => handleChange("waterLiters", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="calories" className="text-sm font-medium text-slate-600">
            Calories
          </label>
          <input
            id="calories"
            type="number"
            min={0}
            step={25}
            value={form.calories}
            onChange={(event) => handleChange("calories", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-600">Mood</span>
          <div className="flex flex-wrap gap-3">
            {(["energized", "steady", "tired"] satisfies HealthEntry["mood"][]).map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleChange("mood", option)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm capitalize transition-colors",
                    form.mood === option
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                      : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600",
                  )}
                >
                  {option}
                </button>
              ),
            )}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="health-notes" className="text-sm font-medium text-slate-600">
            Notes (energy, stress, wins)
          </label>
          <textarea
            id="health-notes"
            rows={3}
            value={form.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="How did you feel today?"
          />
        </fieldset>
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2"
      >
        Save daily check-in
      </button>
    </form>
  );
}

export function WorkoutForm({ onSubmit }: BaseFormProps<WorkoutEntry>) {
  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    [],
  );
  const [form, setForm] = useState({
    date: today,
    type: "Strength",
    durationMinutes: 45,
    intensity: "medium" as WorkoutEntry["intensity"],
    caloriesBurned: 450,
    notes: "",
  });

  const handleChange = (
    field: keyof typeof form,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      durationMinutes: Number(form.durationMinutes),
      caloriesBurned: Number(form.caloriesBurned),
      notes: form.notes.trim() || undefined,
    });
    setForm((prev) => ({
      ...prev,
      notes: "",
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <header className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-slate-900">
          Workout Session
        </h3>
        <p className="text-sm text-slate-500">
          Log structured training to track consistency and load.
        </p>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="workout-date" className="text-sm font-medium text-slate-600">
            Date
          </label>
          <input
            id="workout-date"
            type="date"
            value={form.date}
            onChange={(event) => handleChange("date", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="workout-type" className="text-sm font-medium text-slate-600">
            Session Focus
          </label>
          <input
            id="workout-type"
            type="text"
            value={form.type}
            onChange={(event) => handleChange("type", event.target.value)}
            placeholder="Strength, run, yoga..."
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="duration" className="text-sm font-medium text-slate-600">
            Duration (min)
          </label>
          <input
            id="duration"
            type="number"
            min={5}
            step={5}
            value={form.durationMinutes}
            onChange={(event) => handleChange("durationMinutes", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">Intensity</label>
          <div className="flex gap-3">
            {(["low", "medium", "high"] satisfies WorkoutEntry["intensity"][]).map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleChange("intensity", option)}
                  className={cn(
                    "flex-1 rounded-xl border px-4 py-2 text-sm capitalize transition-colors",
                    form.intensity === option
                      ? "border-violet-500 bg-violet-500/10 text-violet-600"
                      : "border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600",
                  )}
                >
                  {option}
                </button>
              ),
            )}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="workout-calories" className="text-sm font-medium text-slate-600">
            Calories burned
          </label>
          <input
            id="workout-calories"
            type="number"
            min={0}
            step={25}
            value={form.caloriesBurned}
            onChange={(event) =>
              handleChange("caloriesBurned", event.target.value)
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="workout-notes" className="text-sm font-medium text-slate-600">
            Session notes
          </label>
          <textarea
            id="workout-notes"
            rows={3}
            value={form.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="Key lifts, pace, how you felt..."
          />
        </fieldset>
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-offset-2"
      >
        Log workout
      </button>
    </form>
  );
}

export function WeightForm({ onSubmit }: BaseFormProps<WeightEntry>) {
  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    [],
  );
  const [form, setForm] = useState({
    date: today,
    weightKg: 70,
    bodyFat: 18,
  });

  const handleChange = (
    field: keyof typeof form,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      weightKg: Number(form.weightKg),
      bodyFat: form.bodyFat ? Number(form.bodyFat) : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <header className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-slate-900">
          Weight Check
        </h3>
        <p className="text-sm text-slate-500">
          Capture your weight trend and estimate of body composition.
        </p>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <fieldset className="flex flex-col gap-2 md:col-span-3">
          <label htmlFor="weight-date" className="text-sm font-medium text-slate-600">
            Date
          </label>
          <input
            id="weight-date"
            type="date"
            value={form.date}
            onChange={(event) => handleChange("date", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="weight-kg" className="text-sm font-medium text-slate-600">
            Weight (kg)
          </label>
          <input
            id="weight-kg"
            type="number"
            min={20}
            step={0.1}
            value={form.weightKg}
            onChange={(event) => handleChange("weightKg", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="body-fat" className="text-sm font-medium text-slate-600">
            Body fat %
          </label>
          <input
            id="body-fat"
            type="number"
            min={0}
            max={75}
            step={0.1}
            value={form.bodyFat ?? ""}
            onChange={(event) => handleChange("bodyFat", event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="optional"
          />
        </fieldset>
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2"
      >
        Record measurement
      </button>
    </form>
  );
}
