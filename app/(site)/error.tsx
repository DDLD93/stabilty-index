"use client";

import { useEffect } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-section">
      <div className="max-w-2xl">
        <h1 className="text-display">Something went wrong</h1>
        <p className="mt-5 text-lead text-ink-2">
          This page didn’t load properly. It is usually a brief problem with the connection or our server; please try
          again in a moment.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <LinkButton href="/" variant="secondary">
            Go to the home page
          </LinkButton>
        </div>
        {error.digest ? <p className="mt-8 text-meta text-ink-3">Reference: {error.digest}</p> : null}
      </div>
    </Container>
  );
}
