/** Client-safe zod schemas for NSI Honors forms (used by the forms and re-checked by the API). */

import { z } from "zod";
import { NIGERIAN_STATES } from "@/lib/constants";
import { LIMITS, NOMINATOR_RELATIONS, NOMINEE_TYPES } from "@/lib/honors/constants";

const httpsUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a full web address starting with https://");

export const nominationStepSchemas = {
  category: z.object({
    categoryId: z.string().min(1, "Choose a category."),
    nomineeType: z.enum(NOMINEE_TYPES, { message: "Choose who you are nominating." }),
  }),
  nominee: z.object({
    nomineeName: z
      .string()
      .trim()
      .min(LIMITS.nomineeName.min, "Enter the nominee’s name.")
      .max(LIMITS.nomineeName.max, `Keep the name under ${LIMITS.nomineeName.max} characters.`),
    nomineeState: z.enum(NIGERIAN_STATES).optional().nullable(),
    nomineeLga: z.string().trim().max(LIMITS.lga).optional().nullable(),
    nomineeAffiliation: z.string().trim().max(LIMITS.affiliation).optional().nullable(),
  }),
  reason: z.object({
    reason: z
      .string()
      .trim()
      .min(LIMITS.reason.min, `Tell us a little more: at least ${LIMITS.reason.min} characters.`)
      .max(LIMITS.reason.max, `Keep it under ${LIMITS.reason.max} characters.`),
    evidenceUrls: z.array(httpsUrl).max(LIMITS.evidenceUrls, `Add up to ${LIMITS.evidenceUrls} links.`),
  }),
  you: z.object({
    nominatorName: z.string().trim().max(LIMITS.nominatorName).optional().nullable(),
    nominatorEmail: z.email("Enter a valid email address, like name@example.com."),
    nominatorRelation: z.enum(NOMINATOR_RELATIONS, { message: "Tell us how you know the nominee." }),
    consent: z.literal(true, { message: "Please confirm to continue." }),
  }),
};

export const nominationSchema = nominationStepSchemas.category
  .extend(nominationStepSchemas.nominee.shape)
  .extend(nominationStepSchemas.reason.shape)
  .extend(nominationStepSchemas.you.shape)
  .extend({
    deviceHash: z.string().max(100).optional(),
    referrerCode: z.string().regex(/^\d{6}$/).optional(),
    website: z.string().max(200).optional(), // honeypot
  })
  .superRefine((v, ctx) => {
    if (v.nomineeType === "STATE_OR_LGA" && !v.nomineeState) {
      ctx.addIssue({ code: "custom", path: ["nomineeState"], message: "Choose the state." });
    }
  });

export type NominationInput = z.infer<typeof nominationSchema>;

export const voteRequestSchema = z.object({
  selections: z
    .array(z.object({ categoryId: z.string().min(1), finalistId: z.string().min(1) }))
    .min(1, "Choose at least one finalist.")
    .max(20),
  email: z.email("Enter a valid email address, like name@example.com."),
  consent: z.literal(true, { message: "Please confirm to continue." }),
  deviceHash: z.string().max(100).optional(),
  website: z.string().max(200).optional(), // honeypot
});

export const voteConfirmSchema = z.object({ token: z.string().min(20).max(200) });

export const subscribeSchema = z.object({
  email: z.email("Enter a valid email address, like name@example.com."),
  website: z.string().max(200).optional(), // honeypot
});
