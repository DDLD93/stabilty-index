import { db } from "@/lib/db";

export type CycleSummary = {
  id: string;
  monthYear: string;
  status: string;
};

export type PerCycleAgentRow = {
  agentId: string | null;
  name: string;
  referrerCode: string | null;
  count: number;
};

export async function getAgentCountsForCycle(cycleId: string): Promise<{
  rows: PerCycleAgentRow[];
  totalCount: number;
  unattributedCount: number;
}> {
  const grouped = await db.submission.groupBy({
    by: ["agentId"],
    where: { cycleId },
    _count: { _all: true },
  });

  const totalCount = grouped.reduce((acc, g) => acc + g._count._all, 0);
  const nullGroup = grouped.find((g) => g.agentId === null);
  const unattributedCount = nullGroup?._count._all ?? 0;

  const nonNullIds = grouped.filter((g) => g.agentId != null).map((g) => g.agentId as string);
  const agents =
    nonNullIds.length > 0
      ? await db.agent.findMany({
          where: { id: { in: nonNullIds } },
          select: { id: true, name: true, referrerCode: true },
        })
      : [];

  const rows: PerCycleAgentRow[] = grouped
    .filter((g) => g.agentId != null)
    .map((g) => {
      const a = agents.find((x) => x.id === g.agentId);
      return {
        agentId: g.agentId,
        name: a?.name ?? "Unknown agent",
        referrerCode: a?.referrerCode ?? null,
        count: g._count._all,
      };
    })
    .sort((a, b) => b.count - a.count);

  return { rows, totalCount, unattributedCount };
}

export type CrossCycleMatrixRow = {
  agentId: string | null;
  name: string;
  referrerCode: string | null;
  countsByCycleId: Record<string, number>;
  totalInWindow: number;
};

export async function getCrossCycleAgentMatrix(limitCycles: number): Promise<{
  cycles: CycleSummary[];
  matrix: CrossCycleMatrixRow[];
}> {
  const take = Math.min(Math.max(limitCycles, 1), 48);
  const cycles = await db.cycle.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: { id: true, monthYear: true, status: true },
  });
  const cycleIds = cycles.map((c) => c.id);
  if (cycleIds.length === 0) {
    return { cycles: [], matrix: [] };
  }

  const grouped = await db.submission.groupBy({
    by: ["agentId", "cycleId"],
    where: { cycleId: { in: cycleIds } },
    _count: { _all: true },
  });

  const agentIds = [...new Set(grouped.map((g) => g.agentId).filter((id): id is string => id != null))];
  const agents = await db.agent.findMany({
    select: { id: true, name: true, referrerCode: true },
    orderBy: { name: "asc" },
  });

  const countsForAgent = (agentId: string | null) => {
    const map: Record<string, number> = {};
    let total = 0;
    for (const c of cycleIds) {
      const row = grouped.find((g) => g.agentId === agentId && g.cycleId === c);
      const n = row?._count._all ?? 0;
      map[c] = n;
      total += n;
    }
    return { map, total };
  }

  const matrix: CrossCycleMatrixRow[] = [];

  for (const a of agents) {
    const { map, total } = countsForAgent(a.id);
    if (total === 0) continue;
    matrix.push({
      agentId: a.id,
      name: a.name,
      referrerCode: a.referrerCode,
      countsByCycleId: map,
      totalInWindow: total,
    });
  }

  const { map: unattribMap, total: unattribTotal } = countsForAgent(null);
  if (unattribTotal > 0) {
    matrix.push({
      agentId: null,
      name: "Direct / unattributed",
      referrerCode: null,
      countsByCycleId: unattribMap,
      totalInWindow: unattribTotal,
    });
  }

  matrix.sort((a, b) => b.totalInWindow - a.totalInWindow);

  return {
    cycles: cycles.map((c) => ({
      id: c.id,
      monthYear: c.monthYear,
      status: c.status,
    })),
    matrix,
  };
}
