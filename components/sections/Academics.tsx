"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  Download,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  bestSubject,
  isValidAcademicsData,
  mostImproved,
  overallAverage,
  subjectYearAverage,
  termAverages,
  useAcademicsData,
} from "@/lib/useAcademicsData";
import type { AcademicsData, UpcomingItem } from "@/lib/data";

const cardBase =
  "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]";

const inputBase =
  "rounded-md bg-black/[0.03] px-2 py-1 outline-none transition focus:bg-transparent focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--color-accent)_45%,transparent)] dark:bg-white/[0.05]";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso: string): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function MarkInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <input
      type="number"
      step="0.1"
      min="0"
      max="100"
      value={value === null ? "" : value}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") onChange(null);
        else {
          const n = Number(raw);
          onChange(Number.isFinite(n) ? n : null);
        }
      }}
      className={`${inputBase} w-16 text-right tabular-nums text-[14px]`}
    />
  );
}

function TextInput({
  value,
  onChange,
  className = "",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} text-[14px] ${className}`}
    />
  );
}

function DateInput({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} text-[14px] ${className}`}
    />
  );
}

const primaryBtn =
  "inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]";
const ghostBtn =
  "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--color-fg)] transition hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.98]";

export function Academics() {
  const { data, save } = useAcademicsData();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<AcademicsData>(data);

  useEffect(() => {
    if (!editing) setDraft(data);
  }, [data, editing]);

  const active = editing ? draft : data;

  const overall = overallAverage(active);
  const terms = termAverages(active);
  const best = bestSubject(active);
  const improved = mostImproved(active);

  const [chartReady, setChartReady] = useState(false);
  useEffect(() => setChartReady(true), []);

  function startEdit() {
    setDraft(data);
    setEditing(true);
  }
  function cancelEdit() {
    setDraft(data);
    setEditing(false);
  }
  function saveEdit() {
    save(draft);
    setEditing(false);
  }

  function patchSubjectName(idx: number, name: string) {
    setDraft((d) => ({
      ...d,
      subjects: d.subjects.map((s, i) => (i === idx ? { ...s, name } : s)),
    }));
  }

  function patchSubjectMark(
    idx: number,
    termIdx: number,
    value: number | null,
  ) {
    setDraft((d) => ({
      ...d,
      subjects: d.subjects.map((s, i) =>
        i === idx
          ? {
              ...s,
              marks: s.marks.map((m, ti) => (ti === termIdx ? value : m)),
            }
          : s,
      ),
    }));
  }

  function patchTermLabel(idx: number, label: string) {
    setDraft((d) => ({
      ...d,
      termLabels: d.termLabels.map((l, i) => (i === idx ? label : l)),
    }));
  }

  function patchUpcoming(
    id: string,
    field: keyof Omit<UpcomingItem, "id">,
    value: string,
  ) {
    setDraft((d) => ({
      ...d,
      upcoming: d.upcoming.map((it) =>
        it.id === id ? { ...it, [field]: value } : it,
      ),
    }));
  }

  function addUpcoming() {
    setDraft((d) => ({
      ...d,
      upcoming: [
        ...d.upcoming,
        {
          id: generateId(),
          subject: "",
          type: "Test",
          date: "",
          notes: "",
        },
      ],
    }));
  }

  function removeUpcoming(id: string) {
    setDraft((d) => ({
      ...d,
      upcoming: d.upcoming.filter((it) => it.id !== id),
    }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `academics-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const fileRef = useRef<HTMLInputElement>(null);
  function importClick() {
    fileRef.current?.click();
  }
  function importFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    file.text().then((text) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        alert("That file isn't valid JSON.");
        return;
      }
      if (!isValidAcademicsData(parsed)) {
        alert("That file doesn't look like academics data.");
        return;
      }
      const ok = window.confirm(
        "Replace all current academics data with the contents of this file?",
      );
      if (!ok) return;
      save(parsed);
      setEditing(false);
    });
  }

  return (
    <section
      id="academics"
      className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:px-8 sm:py-24"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Academics
          </h2>
          <p className="mt-2 text-base text-[var(--color-muted)]">
            Grade 11 IEB · marks, trends, and what&rsquo;s next.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {editing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="flex gap-2"
              >
                <button onClick={cancelEdit} className={ghostBtn}>
                  <X size={14} strokeWidth={2} />
                  Cancel
                </button>
                <button onClick={saveEdit} className={primaryBtn}>
                  <Check size={14} strokeWidth={2.25} />
                  Save
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="edit"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                onClick={startEdit}
                className={ghostBtn}
              >
                <Pencil size={14} strokeWidth={2} />
                Edit
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Stat cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <motion.div variants={fadeUp} className={`${cardBase} p-6`}>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
            <TrendingUp size={14} strokeWidth={2} />
            Overall average
          </div>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
              {overall === null ? "—" : overall}
            </span>
            {overall !== null && (
              <span className="text-2xl font-medium text-[var(--color-muted)]">
                %
              </span>
            )}
          </div>
          <div className="mt-2 text-[13px] text-[var(--color-muted)]">
            Term-to-date
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className={`${cardBase} p-6`}>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
            <Sparkles size={14} strokeWidth={2} />
            Best performing
          </div>
          <div className="mt-5 text-2xl font-semibold tracking-tight sm:text-[26px]">
            {best?.name ?? "—"}
          </div>
          <div className="mt-2 text-[13px] text-[var(--color-muted)]">
            {best ? (
              <>
                <span className="font-medium text-[var(--color-fg)] tabular-nums">
                  {best.mark}%
                </span>{" "}
                this term
              </>
            ) : (
              "No marks yet"
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className={`${cardBase} p-6`}>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
            <Target size={14} strokeWidth={2} />
            Most improved
          </div>
          <div className="mt-5 text-2xl font-semibold tracking-tight sm:text-[26px]">
            {improved?.name ?? "—"}
          </div>
          <div className="mt-2 text-[13px] text-[var(--color-muted)]">
            {improved ? (
              <>
                <span className="font-medium tabular-nums text-[var(--color-accent)]">
                  {improved.delta >= 0 ? "+" : ""}
                  {improved.delta}
                </span>{" "}
                vs last term
              </>
            ) : (
              "Need two terms of data"
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`${cardBase} mt-6 p-6 sm:p-8`}
      >
        <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Average by term
        </h3>
        <div
          className="relative mt-6 w-full min-w-0"
          style={{ height: 260, minHeight: 260 }}
        >
          {chartReady && (
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={260}
            >
              <LineChart
                data={terms}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="term"
                  stroke="var(--color-muted)"
                  tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis
                  domain={[60, 100]}
                  stroke="var(--color-muted)"
                  tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    fontSize: 12,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  }}
                  labelStyle={{
                    color: "var(--color-muted)",
                    marginBottom: 4,
                  }}
                  itemStyle={{ color: "var(--color-fg)" }}
                  formatter={(value) => [
                    value == null ? "—" : `${value}%`,
                    "Average",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  connectNulls
                  dot={{
                    r: 3,
                    fill: "var(--color-accent)",
                    stroke: "var(--color-accent)",
                  }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={!editing}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Prep cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-6 grid gap-4 sm:grid-cols-3"
      >
        {active.prep.map((card) => (
          <motion.div
            key={card.id}
            variants={fadeUp}
            className={`${cardBase} p-6`}
          >
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
              {card.kind === "target" ? (
                <Target size={14} strokeWidth={2} />
              ) : (
                <CalendarDays size={14} strokeWidth={2} />
              )}
              {card.title}
            </div>
            {card.kind === "date" ? (
              <>
                <div className="mt-5 text-2xl font-semibold tracking-tight tabular-nums">
                  {formatDate(card.date)}
                </div>
                <div className="mt-2 text-[13px] text-[var(--color-muted)]">
                  {card.subtitle}
                  {daysUntil(card.date) !== null && (
                    <>
                      {" "}
                      · in{" "}
                      <span className="tabular-nums">
                        {daysUntil(card.date)}
                      </span>{" "}
                      days
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight tabular-nums">
                    {card.target}
                  </span>
                  <span className="text-xl font-medium text-[var(--color-muted)]">
                    %
                  </span>
                </div>
                <div className="mt-2 text-[13px] text-[var(--color-muted)]">
                  {card.subtitle} · currently{" "}
                  <span className="font-medium text-[var(--color-fg)] tabular-nums">
                    {card.current}%
                  </span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Table + Upcoming */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`${cardBase} overflow-hidden lg:col-span-2`}
        >
          <div className="px-6 pt-6 pb-2">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Subject marks
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  <th className="py-3 pl-6 pr-3 font-medium">Subject</th>
                  {active.termLabels.map((label, i) => (
                    <th
                      key={i}
                      className="px-3 py-3 text-right font-medium align-middle"
                    >
                      {editing ? (
                        <input
                          type="text"
                          value={label}
                          onChange={(e) => patchTermLabel(i, e.target.value)}
                          className={`${inputBase} w-20 text-right text-[11px] uppercase tracking-[0.12em]`}
                        />
                      ) : (
                        label
                      )}
                    </th>
                  ))}
                  <th className="py-3 pl-3 pr-6 text-right font-medium">
                    Year avg
                  </th>
                </tr>
              </thead>
              <tbody>
                {active.subjects.map((s, idx) => {
                  const yearAvg = subjectYearAverage(s.marks);
                  return (
                    <tr
                      key={s.id}
                      className="border-t border-[var(--color-border)] transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                    >
                      <td className="py-3 pl-6 pr-3 font-medium align-middle">
                        {editing ? (
                          <TextInput
                            value={s.name}
                            onChange={(v) => patchSubjectName(idx, v)}
                            className="w-full"
                          />
                        ) : (
                          s.name
                        )}
                      </td>
                      {s.marks.map((m, ti) => (
                        <td
                          key={ti}
                          className="px-3 py-3 text-right tabular-nums align-middle"
                        >
                          {editing ? (
                            <div className="flex justify-end">
                              <MarkInput
                                value={m}
                                onChange={(v) =>
                                  patchSubjectMark(idx, ti, v)
                                }
                              />
                            </div>
                          ) : (
                            <span className="text-[var(--color-muted)]">
                              {m === null ? "—" : m}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="py-3 pl-3 pr-6 text-right font-semibold tabular-nums align-middle">
                        {yearAvg === null ? "—" : yearAvg}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
          className={`${cardBase} flex flex-col p-6`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
              <CalendarDays size={14} strokeWidth={2} />
              Upcoming
            </div>
            {editing && (
              <button
                onClick={addUpcoming}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[12px] text-[var(--color-fg)] transition hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                <Plus size={12} strokeWidth={2.25} />
                Add
              </button>
            )}
          </div>

          <ul className="mt-5 flex flex-col divide-y divide-[var(--color-border)]">
            <AnimatePresence initial={false}>
              {active.upcoming.length === 0 && (
                <motion.li
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-3 text-[13px] text-[var(--color-muted)]"
                >
                  Nothing scheduled.
                </motion.li>
              )}
              {active.upcoming.map((item) => {
                const d = daysUntil(item.date);
                return (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="py-4 first:pt-3 last:pb-0"
                  >
                    {editing ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start gap-2">
                          <TextInput
                            value={item.subject}
                            onChange={(v) =>
                              patchUpcoming(item.id, "subject", v)
                            }
                            placeholder="Subject"
                            className="flex-1"
                          />
                          <button
                            aria-label="Remove item"
                            onClick={() => removeUpcoming(item.id)}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-muted)] transition hover:bg-black/[0.04] hover:text-[var(--color-fg)] dark:hover:bg-white/[0.06]"
                          >
                            <Trash2 size={14} strokeWidth={2} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <TextInput
                            value={item.type}
                            onChange={(v) =>
                              patchUpcoming(item.id, "type", v)
                            }
                            placeholder="Type"
                            className="w-28"
                          />
                          <DateInput
                            value={item.date}
                            onChange={(v) =>
                              patchUpcoming(item.id, "date", v)
                            }
                            className="flex-1"
                          />
                        </div>
                        <TextInput
                          value={item.notes}
                          onChange={(v) =>
                            patchUpcoming(item.id, "notes", v)
                          }
                          placeholder="Notes"
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="text-[15px] font-medium">
                          {item.subject || "Untitled"}
                        </div>
                        <div className="mt-0.5 text-[13px] text-[var(--color-muted)]">
                          {item.type}
                          {item.date && (
                            <>
                              {" "}
                              · {formatDate(item.date)}
                              {d !== null && (
                                <>
                                  {" "}
                                  · in{" "}
                                  <span className="tabular-nums">{d}</span>{" "}
                                  days
                                </>
                              )}
                            </>
                          )}
                        </div>
                        {item.notes && (
                          <div className="mt-1 text-[13px] text-[var(--color-muted)]">
                            {item.notes}
                          </div>
                        )}
                      </>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>

      {/* Export / Import footer */}
      <div className="mt-10 flex flex-wrap items-center justify-end gap-2 text-[var(--color-muted)]">
        <button onClick={exportData} className={ghostBtn}>
          <Download size={14} strokeWidth={2} />
          Export data
        </button>
        <button onClick={importClick} className={ghostBtn}>
          <Upload size={14} strokeWidth={2} />
          Import data
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={importFile}
          className="hidden"
        />
      </div>
    </section>
  );
}
