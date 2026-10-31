"use client";

// Last-resort error page: it replaces the root layout, so it carries its own minimal styles.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-NG">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", color: "#14211b", background: "#ffffff" }}>
        <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "4rem 1.25rem" }}>
          <h1 style={{ fontSize: "2rem", lineHeight: 1.15, margin: 0 }}>The Nigeria Stability Index is having trouble</h1>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, color: "#45534c" }}>
            Something went wrong while loading the site. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: "3rem",
              padding: "0 1.25rem",
              border: 0,
              borderRadius: 6,
              background: "#1d6b45",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
