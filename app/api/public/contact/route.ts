import { NextResponse } from "next/server";
import { z } from "zod";
import { isContactMailConfigured, sendContactEmail } from "@/lib/contactMailer";
import { contactSubjectSchema } from "@/lib/contactSubjects";

const contactPostSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254),
    message: z.string().trim().min(1).max(4000),
    subject: contactSubjectSchema,
    subjectOther: z.string().trim().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.subject === "other") {
      const detail = data.subjectOther?.trim() ?? "";
      if (detail.length < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Please specify your topic.",
          path: ["subjectOther"],
        });
      }
    }
  });

export async function POST(req: Request) {
  if (!isContactMailConfigured()) {
    return NextResponse.json(
      { error: "Contact form is temporarily unavailable." },
      { status: 503 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = contactPostSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, message, subject, subjectOther } = parsed.data;

  try {
    await sendContactEmail({
      name,
      email,
      subjectKey: subject,
      subjectOther: subject === "other" ? subjectOther?.trim() : undefined,
      message,
    });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
