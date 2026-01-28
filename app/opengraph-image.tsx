import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/metadata";

/**
 * Generate Open Graph image (1200x630px)
 * This image is used when sharing the site on social media
 */
export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a4d3a 0%, #2d5a47 50%, #1a4d3a 100%)",
          position: "relative",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {/* Shield Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="ogShieldG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#D4AF37" stopOpacity="1" />
                  <stop offset="1" stopColor="#B8941E" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="ogShieldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4A5568" stopOpacity="1" />
                  <stop offset="1" stopColor="#2D3748" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M32 6c10 7 18 6 24 6 0 28-9 38-24 46C17 50 8 40 8 12c6 0 14 1 24-6Z"
                fill="url(#ogShieldG)"
              />
              <path
                d="M32 11c8 5.6 14 5.1 19 5.2 0 23.5-7.2 31.7-19 38-11.8-6.3-19-14.5-19-38 5-.1 11 .4 19-5.2Z"
                fill="url(#ogShieldFill)"
              />
              <path d="M32 14v36" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="3.2" />
              <path d="M18 30h28" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="3.2" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: 20,
              fontFamily: "serif",
            }}
          >
            {siteConfig.name}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: "#D4AF37",
              textAlign: "center",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            A calm snapshot of how Nigeria is holding together
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.8)",
              textAlign: "center",
              marginTop: 30,
              maxWidth: 800,
            }}
          >
            Tracking stability through security, economy, governance, and social cohesion
          </div>
        </div>

        {/* Footer branding */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 18,
            color: "rgba(255, 255, 255, 0.6)",
            fontFamily: "serif",
          }}
        >
          A project of the <span style={{ color: "#D4AF37" }}>&apos;24 Angels Initiative</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
