import type { Metadata } from "next";
import { TokenAction } from "@/components/public/TokenAction";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { EmptyState } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = { ...defaultMetadata, title: "Confirm your email", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ConfirmSubscriptionPage({ searchParams }: Props) {
  const { token } = await searchParams;
  return (
    <Container className="pt-10 pb-16 sm:pt-14 sm:pb-24">
      <div className="max-w-[40rem]">
        <h1 className="text-h2">Confirm your email updates</h1>
        {token ? (
          <div className="mt-8">
            <TokenAction
              endpoint="/api/public/subscribe/confirm"
              token={token}
              label="Confirm my email"
              busyLabel="Confirming…"
              successTitle="You’re signed up"
              successBody="You’ll get an email when each monthly report is published."
            />
          </div>
        ) : (
          <EmptyState className="mt-8" title="Open the link from your email" action={<LinkButton href="/subscribe">Sign up again</LinkButton>}>
            To confirm, open the link we emailed you. It brings you back here.
          </EmptyState>
        )}
      </div>
    </Container>
  );
}
