import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export type HeaderCycle = { open: boolean; monthYear: string | null };

/** Whether a survey cycle is open right now. Cached briefly: it only drives the header's call to action. */
export const getHeaderCycle = unstable_cache(
  async (): Promise<HeaderCycle> => {
    try {
      const open = await db.cycle.findFirst({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        select: { monthYear: true },
      });
      return { open: Boolean(open), monthYear: open?.monthYear ?? null };
    } catch {
      return { open: false, monthYear: null };
    }
  },
  ["header-cycle"],
  { revalidate: 120 },
);

/** "October 2026" → "October". Falls back to the full label if it doesn't look like "Month Year". */
export function monthOnly(monthYear: string | null): string | null {
  if (!monthYear) return null;
  const match = monthYear.trim().match(/^([A-Za-z]+)\s+\d{4}$/);
  return match ? match[1] : monthYear.trim();
}
