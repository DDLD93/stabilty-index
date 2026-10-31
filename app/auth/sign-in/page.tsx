"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { controlClass, Field, FormMessage } from "@/components/ui/Form";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}

function SignInInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/admin", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);

    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(res.url ?? callbackUrl);
  }

  return (
    <div className="w-full max-w-md border border-line bg-ground px-6 py-8 sm:px-8 sm:py-10">
      <h1 className="text-h2">Admin sign-in</h1>
      <p className="mt-2 text-body text-ink-2">For the NSI editorial team.</p>

      <form className="mt-8 flex flex-col gap-6" onSubmit={onSubmit}>
        <Field label="Email address">
          {({ id, describedBy }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              className={controlClass}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
        </Field>
        <Field label="Password">
          {({ id, describedBy }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              className={controlClass}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
        </Field>

        {error ? <FormMessage tone="error">{error}</FormMessage> : null}

        <Button type="submit" disabled={loading} aria-busy={loading} block>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
