import { ImageResponse } from "next/og";

/**
 * Generate favicon and app icons
 * Next.js will automatically generate favicon.ico, icon.png, apple-icon.png, etc.
 */
export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #D4AF37 0%, #B8941E 100%)",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="nsiShieldG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D4AF37" stopOpacity="1" />
              <stop offset="1" stopColor="#B8941E" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="nsiShieldFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4A5568" stopOpacity="1" />
              <stop offset="1" stopColor="#2D3748" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M32 6c10 7 18 6 24 6 0 28-9 38-24 46C17 50 8 40 8 12c6 0 14 1 24-6Z"
            fill="url(#nsiShieldG)"
          />
          <path
            d="M32 11c8 5.6 14 5.1 19 5.2 0 23.5-7.2 31.7-19 38-11.8-6.3-19-14.5-19-38 5-.1 11 .4 19-5.2Z"
            fill="url(#nsiShieldFill)"
          />
          <path d="M32 14v36" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="3.2" />
          <path d="M18 30h28" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="3.2" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
