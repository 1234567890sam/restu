import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MenuQR — Contactless Digital QR Menu for Restaurants";
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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b18 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow ambient spots */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234, 88, 12, 0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Header Bar: Logo & Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px rgba(245, 158, 11, 0.35)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "-0.03em" }}>
                Menu<span style={{ color: "#f59e0b" }}>QR</span>
              </span>
              <span style={{ fontSize: "14px", color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Restaurant Digital SaaS
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "#fbbf24",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            <span>⚡ Ready in 2 Minutes</span>
          </div>
        </div>

        {/* Center Content: Headline + Visual Card Preview */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "40px",
            marginTop: "20px",
          }}
        >
          {/* Left Column: Headlines */}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "620px" }}>
            <h1
              style={{
                fontSize: "52px",
                fontWeight: "900",
                lineHeight: "1.15",
                letterSpacing: "-0.03em",
                margin: 0,
                color: "#ffffff",
              }}
            >
              Contactless <span style={{ color: "#f59e0b" }}>QR Digital Menus</span> for Modern Restaurants
            </h1>
            <p
              style={{
                fontSize: "22px",
                color: "#cbd5e1",
                marginTop: "20px",
                lineHeight: "1.4",
              }}
            >
              Scan & Order instantly. Zero customer app required. Dynamic pricing, FSSAI veg/non-veg tags & instant table stand QR codes.
            </p>
          </div>

          {/* Right Column: Visual Preview Card */}
          <div
            style={{
              width: "360px",
              borderRadius: "24px",
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981" }} />
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>Live Table #04</span>
              </div>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Scan with Camera</span>
            </div>

            {/* Menu Item Mock 1 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "14px",
                backgroundColor: "rgba(30, 41, 59, 0.6)",
                marginBottom: "10px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #16a34a",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#16a34a" }} />
                </div>
                <span style={{ fontSize: "15px", fontWeight: "700" }}>Paneer Tikka Masala</span>
              </div>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "#f59e0b" }}>₹280</span>
            </div>

            {/* Menu Item Mock 2 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "14px",
                backgroundColor: "rgba(30, 41, 59, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #dc2626",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#dc2626" }} />
                </div>
                <span style={{ fontSize: "15px", fontWeight: "700" }}>Chicken Dum Biryani</span>
              </div>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "#f59e0b" }}>₹340</span>
            </div>
          </div>
        </div>

        {/* Footer: Trust Points & Domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "28px", color: "#94a3b8", fontSize: "16px" }}>
            <span>✓ No App Required</span>
            <span>✓ Table Stand Generator</span>
            <span>✓ Real-time Updates</span>
          </div>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#f59e0b" }}>
            menurestu.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
