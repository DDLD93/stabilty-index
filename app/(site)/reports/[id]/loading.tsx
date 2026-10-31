import { Container } from "@/components/ui/Layout";

export default function ReportLoading() {
  return (
    <div aria-busy="true" aria-label="Loading the report">
      <div className="border-b border-line pt-8 pb-10 sm:pt-10 sm:pb-12">
        <Container>
          <div className="h-4 w-40 bg-surface" />
          <div className="mt-6 h-12 w-full max-w-2xl bg-surface" />
          <div className="mt-3 h-12 w-2/3 max-w-xl bg-surface" />
          <div className="mt-6 h-5 w-full max-w-xl bg-surface" />
        </Container>
      </div>
      <Container className="py-10">
        <div className="flex max-w-4xl flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-full bg-surface" />
          ))}
        </div>
      </Container>
    </div>
  );
}
