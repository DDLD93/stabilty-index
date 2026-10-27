"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { NSIShieldMark } from "@/components/public/icons";

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
  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") ?? "/admin",
    [searchParams]
  );

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
    <div className="min-h-screen bg-[color:var(--nsi-paper)] px-6 py-20">
      <div className="mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] border-t-4 border-t-[color:var(--nsi-green)] bg-white shadow-md">
          <div className="border-b border-[color:var(--nsi-rule)] bg-[color:var(--nsi-green-deep)] px-8 py-6 text-white">
            <div className="flex items-center gap-3">
              <NSIShieldMark className="h-9 w-9 shrink-0" />
              <div>
                <div className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[color:var(--nsi-gold-light)]">
                  Authorized Personnel
                </div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
                  Admin Sign-In
                </h1>
              </div>
            </div>
          </div>

          <div className="p-8">
            <p className="text-sm text-[color:var(--nsi-ink-soft)]">
              Enter your research desk credentials to access NSI cycle,
              submission, and snapshot management tools.
            </p>

            <form className="mt-6 space-y-5" onSubmit={onSubmit}>
              <label className="block">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
                  Email
                </span>
                <input
                  className="admin-input mt-1.5"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
                  Password
                </span>
                <input
                  className="admin-input mt-1.5"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {error ? (
                <div className="rounded-[3px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                className="btn-nsi-primary w-full justify-center disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in to Desk →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
