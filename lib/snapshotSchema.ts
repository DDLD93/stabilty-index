import { z } from "zod";
import { PILLAR_MAX, PILLAR_MIN } from "@/lib/reportFormat";

/** Pillar scores as the admin editor sends them; every score must be on the 0–10 scale shown on the site. */
export const pillarScoresSchema = z
  .object({
    pillars: z
      .array(
        z
          .object({
            title: z.string().trim().min(1, "Every pillar needs a title."),
            score: z
              .number()
              .min(PILLAR_MIN, `Pillar scores must be between ${PILLAR_MIN} and ${PILLAR_MAX}.`)
              .max(PILLAR_MAX, `Pillar scores must be between ${PILLAR_MIN} and ${PILLAR_MAX}.`),
            summary: z.string().optional().default(""),
          })
          .passthrough()
      )
      .length(5, "An edition has exactly five pillars."),
  })
  .passthrough();
