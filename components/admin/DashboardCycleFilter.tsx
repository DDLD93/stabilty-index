"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CycleFilter } from "./CycleFilter";

type DashboardCycleFilterProps = {
  selectedCycleId: string | null;
};

export function DashboardCycleFilter({ selectedCycleId }: DashboardCycleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(cycleId: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (cycleId) {
      params.set("cycleId", cycleId);
    } else {
      params.delete("cycleId");
    }
    const q = params.toString();
    router.push(q ? `/admin?${q}` : "/admin");
  }

  return (
    <CycleFilter
      value={selectedCycleId}
      onChange={handleChange}
      showAllOption={false}
      id="dashboard-cycle-filter"
      className="mb-4"
    />
  );
}
