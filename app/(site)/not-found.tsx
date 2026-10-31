import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";

export function NotFoundContent() {
  return (
    <Container className="py-section">
      <div className="max-w-2xl">
        <h1 className="text-display">We can’t find that page</h1>
        <p className="mt-5 text-lead text-ink-2">
          The link may be out of date, or the page may have moved. Reports keep their address once published, so
          if you followed a report link, try the archive.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/reports">Browse the reports</LinkButton>
          <LinkButton href="/" variant="secondary">
            Go to the home page
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}

export default NotFoundContent;
