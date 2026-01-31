"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

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
    <div className="min-h-screen bg-[color:var(--nsi-paper)] px-6 py-20">
      <div className="mx-auto w-full max-w-md">
        <div className="nsi-section-card px-8 py-10">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
              Admin access
            </div>
            <h1 className="mt-5 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
              Admin sign-in
            </h1>
            <p className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">
              Use your admin credentials to access NSI tools.
            </p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Email</span>
                <input
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-[color:var(--nsi-ink)] outline-none ring-0 transition-all focus:border-[color:var(--nsi-green)] focus:bg-white"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Password</span>
                <input
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-[color:var(--nsi-ink)] outline-none ring-0 transition-all focus:border-[color:var(--nsi-green)] focus:bg-white"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                className="w-full rounded-xl bg-[color:var(--nsi-green)] px-4 py-3 font-medium text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

