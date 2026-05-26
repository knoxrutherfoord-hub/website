"use client";

import { useCallback, useEffect, useState } from "react";
import { academicsDefaults, type AcademicsData } from "./data";

export const STORAGE_KEY = "academics-data-v1";

function readStorage(): AcademicsData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidAcademicsData(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(data: AcademicsData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function isValidAcademicsData(value: unknown): value is AcademicsData {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<AcademicsData>;
  return (
    Array.isArray(v.termLabels) &&
    Array.isArray(v.subjects) &&
    Array.isArray(v.prep) &&
    Array.isArray(v.upcoming)
  );
}

export function useAcademicsData() {
  const [data, setData] = useState<AcademicsData>(academicsDefaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    if (stored) setData(stored);
    setHydrated(true);
  }, []);

  const save = useCallback((next: AcademicsData) => {
    setData(next);
    writeStorage(next);
  }, []);

  const reset = useCallback(() => {
    setData(academicsDefaults);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []);

  return { data, hydrated, save, reset };
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function isNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function mean(nums: number[]) {
  if (nums.length === 0) return null;
  return round1(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export function subjectYearAverage(marks: (number | null)[]) {
  return mean(marks.filter(isNum));
}

export function termAverages(data: AcademicsData) {
  return data.termLabels.map((label, i) => {
    const marks = data.subjects.map((s) => s.marks[i]).filter(isNum);
    return { term: label, average: mean(marks) };
  });
}

export function overallAverage(data: AcademicsData) {
  const all = data.subjects.flatMap((s) => s.marks).filter(isNum);
  return mean(all);
}

export function currentTermIndex(data: AcademicsData) {
  for (let i = data.termLabels.length - 1; i >= 0; i--) {
    if (data.subjects.some((s) => isNum(s.marks[i]))) return i;
  }
  return -1;
}

export function bestSubject(data: AcademicsData) {
  const idx = currentTermIndex(data);
  if (idx < 0) return null;
  let best: { name: string; mark: number } | null = null;
  for (const s of data.subjects) {
    const m = s.marks[idx];
    if (!isNum(m)) continue;
    if (!best || m > best.mark) best = { name: s.name, mark: m };
  }
  return best;
}

export function mostImproved(data: AcademicsData) {
  const idx = currentTermIndex(data);
  if (idx < 1) return null;
  let result: { name: string; delta: number } | null = null;
  for (const s of data.subjects) {
    const curr = s.marks[idx];
    if (!isNum(curr)) continue;
    let prev: number | null = null;
    for (let p = idx - 1; p >= 0; p--) {
      const v = s.marks[p];
      if (isNum(v)) {
        prev = v;
        break;
      }
    }
    if (prev === null) continue;
    const delta = round1(curr - prev);
    if (!result || delta > result.delta) {
      result = { name: s.name, delta };
    }
  }
  return result;
}
