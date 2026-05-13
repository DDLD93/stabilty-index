import { z } from "zod";

const MAX_LANGS = 5;

/** Snapshot of coarse client environment at submit time (no geolocation, no full UA). */
export const deviceInfoPayloadSchema = z
  .object({
    timezone: z.string().max(120),
    language: z.string().max(40),
    languages: z.array(z.string().max(24)).max(MAX_LANGS).optional(),
    screen: z.object({
      width: z.number().int().min(0).max(100_000),
      height: z.number().int().min(0).max(100_000),
      pixelRatio: z.number().min(0).max(32),
    }),
    viewport: z.object({
      width: z.number().int().min(0).max(100_000),
      height: z.number().int().min(0).max(100_000),
    }),
    hardwareConcurrency: z.number().int().min(0).max(1024).optional(),
    maxTouchPoints: z.number().int().min(0).max(256),
    /** Chromium low-entropy Client Hints (`navigator.userAgentData`). */
    chMobile: z.boolean().optional(),
    chPlatform: z.string().max(120).optional(),
    chBrands: z.string().max(240).optional(),
  })
  .strict();

export type DeviceInfoPayload = z.infer<typeof deviceInfoPayloadSchema>;

type UserAgentDataLite = {
  mobile?: boolean;
  platform?: string;
  brands?: { brand: string; version: string }[];
};

/**
 * Collects non-sensitive device/browser context for analytics.
 * Call from the client only (e.g. at submit time).
 */
export function getClientDeviceInfo(): DeviceInfoPayload | null {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
    const language = navigator.language || "unknown";
    const langs = navigator.languages?.slice(0, MAX_LANGS).filter(Boolean);
    const languages = langs && langs.length > 0 ? [...langs] : undefined;

    let chMobile: boolean | undefined;
    let chPlatform: string | undefined;
    let chBrands: string | undefined;
    const uad = (navigator as Navigator & { userAgentData?: UserAgentDataLite }).userAgentData;
    if (uad && typeof uad.mobile === "boolean") {
      chMobile = uad.mobile;
      if (typeof uad.platform === "string" && uad.platform.length > 0) {
        chPlatform = uad.platform.slice(0, 120);
      }
      if (Array.isArray(uad.brands) && uad.brands.length > 0) {
        chBrands = uad.brands
          .map((b) => `${String(b.brand).slice(0, 32)}/${String(b.version).slice(0, 16)}`)
          .join(";")
          .slice(0, 240);
      }
    }

    return {
      timezone,
      language,
      ...(languages ? { languages } : {}),
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio ?? 1,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      ...(typeof navigator.hardwareConcurrency === "number"
        ? { hardwareConcurrency: navigator.hardwareConcurrency }
        : {}),
      maxTouchPoints: navigator.maxTouchPoints ?? 0,
      ...(chMobile !== undefined ? { chMobile } : {}),
      ...(chPlatform ? { chPlatform } : {}),
      ...(chBrands ? { chBrands } : {}),
    };
  } catch {
    return null;
  }
}

export function formatDeviceInfoSummary(info: unknown): string {
  const parsed = deviceInfoPayloadSchema.safeParse(info);
  if (!parsed.success) return "—";
  const d = parsed.data;
  const parts = [
    `${d.screen.width}×${d.screen.height}`,
    d.language,
    d.timezone.length > 18 ? `${d.timezone.slice(0, 16)}…` : d.timezone,
  ];
  if (d.chMobile === true) parts.push("mobile");
  return parts.join(" · ");
}
