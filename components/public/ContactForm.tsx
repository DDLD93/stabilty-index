"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { controlClass, Field, FormMessage } from "@/components/ui/Form";
import {
  CONTACT_SUBJECT_KEYS,
  CONTACT_SUBJECT_LABELS,
  type ContactSubjectKey,
} from "@/lib/contactSubjects";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<ContactSubjectKey>("general");
  const [subjectOther, setSubjectOther] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          subject,
          ...(subject === "other" ? { subjectOther } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setDone(true);
      setName("");
      setEmail("");
      setSubject("general");
      setSubjectOther("");
      setMessage("");
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <FormMessage tone="success">
        <p className="font-semibold">Thank you. Your message has been sent.</p>
        <p className="mt-1 text-ink-2">We aim to reply within a few working days.</p>
        <Button variant="quiet" className="mt-3" onClick={() => setDone(false)}>
          Send another message
        </Button>
      </FormMessage>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name">
          {({ id, describedBy }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              className={controlClass}
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              required
            />
          )}
        </Field>

        <Field label="Email address" hint="So we can reply.">
          {({ id, describedBy }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              className={controlClass}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
        </Field>
      </div>

      <Field label="What is it about?">
        {({ id, describedBy }) => (
          <select
            id={id}
            aria-describedby={describedBy}
            className={controlClass}
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value as ContactSubjectKey)}
            required
          >
            {CONTACT_SUBJECT_KEYS.map((key) => (
              <option key={key} value={key}>
                {CONTACT_SUBJECT_LABELS[key]}
              </option>
            ))}
          </select>
        )}
      </Field>

      {subject === "other" ? (
        <Field label="Topic" hint="A few words about your message.">
          {({ id, describedBy }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              className={controlClass}
              type="text"
              name="subjectOther"
              value={subjectOther}
              onChange={(e) => setSubjectOther(e.target.value)}
              maxLength={200}
              required
            />
          )}
        </Field>
      ) : null}

      <Field label="Message" counter={{ value: message.length, max: 4000 }}>
        {({ id, describedBy }) => (
          <textarea
            id={id}
            aria-describedby={describedBy}
            className={`${controlClass} min-h-40 resize-y`}
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={4000}
            required
          />
        )}
      </Field>

      {error ? <FormMessage tone="error">{error}</FormMessage> : null}

      <div>
        <Button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
