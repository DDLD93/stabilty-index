import type { Metadata } from "next";
import { TokenAction } from "@/components/public/TokenAction";
import { Container } from "@/components/ui/Layout";
import { EmptyState } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = { ...defaultMetadata, title: "Unsubscribe", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ token?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams;
  return (
    <Container className="pt-10 pb-16 sm:pt-14 sm:pb-24">
      <div className="max-w-[40rem]">
        <h1 className="text-h2">Unsubscribe from email updates</h1>
        {token ? (
          <div className="mt-8">
            <TokenAction
              endpoint="/api/public/subscribe/unsubscribe"
              token={token}
              label="Unsubscribe"
              busyLabel="Unsubscribing…"
              successTitle="You’ve been unsubscribed"
              successBody="You won’t get any more update emails. You can sign up again at any time."
            />
          </div>
        ) : (
          <EmptyState className="mt-8" title="Use the link in any of our emails">
            Every update email has an unsubscribe link at the bottom. You can also write to info@nigeriastabilityindex.ng.
          </EmptyState>
        )}
      </div>
    </Container>
  );
}
