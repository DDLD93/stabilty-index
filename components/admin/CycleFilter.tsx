"use client";

import { useEffect, useState } from "react";

export type CycleOption = {
  id: string;
  monthYear: string;
  status: string;
};

type CycleFilterProps = {
  value: string | null;
  onChange: (cycleId: string | null) => void;
  showAllOption?: boolean;
  id?: string;
  className?: string;
};

export function CycleFilter({
  value,
  onChange,
  showAllOption = false,
  id = "cycle-filter",
  className,
}: CycleFilterProps) {
  const [cycles, setCycles] = useState<CycleOption[]>([]);
  const [currentCycleId, setCurrentCycleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch("/api/admin/cycles");
      if (!res.ok || cancelled) return;
      const data = (await res.json()) as { cycles: CycleOption[]; currentCycleId: string | null };
      if (!cancelled) {
        setCycles(data.cycles);
        setCurrentCycleId(data.currentCycleId);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveValue = value ?? currentCycleId;

  if (loading) {
    return (
      <div className={className} aria-busy="true">
        <span className="text-sm text-[color:var(--nsi-ink-soft)]">Loading cycles…</span>
      </div>
    );
  }

  if (!cycles.length) {
    return (
      <div className={className}>
        <span className="text-sm text-[color:var(--nsi-ink-soft)]">No cycles yet</span>
      </div>
    );
  }

  return (
    <label htmlFor={id} className={className}>
      <span className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
        Cycle
      </span>
      <select
        id={id}
        className="admin-select mt-1.5 w-full min-w-0 sm:w-56"
        value={effectiveValue ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v ? v : null);
        }}
        aria-label="Filter by cycle"
      >
        {showAllOption && <option value="">All cycles</option>}
        {cycles.map((c) => (
          <option key={c.id} value={c.id}>
            {c.monthYear} ({c.status})
          </option>
        ))}
      </select>
    </label>
  );
}
