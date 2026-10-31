"use client";

import { useState } from "react";
import { Check, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Share (native sheet where available, otherwise copy the link) and print. */
export function ShareActions({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const shareUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // dismissed: fall through to copying
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link", shareUrl);
    }
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <Button variant="secondary" size="sm" onClick={share}>
        {copied ? <Check aria-hidden className="size-4" /> : <Share2 aria-hidden className="size-4" />}
        <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
      </Button>
      <Button variant="secondary" size="sm" onClick={() => window.print()}>
        <Printer aria-hidden className="size-4" />
        Print or save as PDF
      </Button>
    </div>
  );
}
