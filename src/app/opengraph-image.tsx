import { ImageResponse } from "next/og";

export const alt = "whatcanidoto.help turns heavy feelings into useful action.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "linear-gradient(135deg, #061733 0%, #092a55 52%, #0b3a70 100%)",
          color: "#f4fdff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "58px 68px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(121,220,255,.24) 1px, transparent 1px), linear-gradient(90deg, rgba(121,220,255,.24) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            inset: 0,
            position: "absolute",
          }}
        />
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                alignItems: "center",
                background: "#ffcf5a",
                borderRadius: 999,
                color: "#061733",
                display: "flex",
                fontSize: 34,
                fontWeight: 900,
                height: 64,
                justifyContent: "center",
                width: 64,
              }}
            >
              ?
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 7 }}>
              WHATCANIDOTO.HELP
            </div>
          </div>
          <div
            style={{
              background: "#63d9ff",
              borderRadius: 999,
              color: "#031426",
              fontSize: 24,
              fontWeight: 900,
              padding: "14px 24px",
            }}
          >
            one useful next move
          </div>
        </div>
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flexDirection: "column",
            maxWidth: 900,
            position: "relative",
          }}
        >
          <div
            style={{
              background: "#ffcf5a",
              borderRadius: 999,
              color: "#061733",
              display: "flex",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: 4,
              marginBottom: 30,
              padding: "12px 22px",
              textTransform: "uppercase",
            }}
          >
            Turn emotional energy into action
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 0.94,
            }}
          >
            The world feels heavy. Choose one useful next move.
          </div>
          <div
            style={{
              color: "#c6eefe",
              fontSize: 31,
              fontWeight: 700,
              lineHeight: 1.35,
              marginTop: 30,
              maxWidth: 830,
            }}
          >
            For climate dread, war headlines, local crises, and the long list
            of things you are told to care about.
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            color: "#9ed4e8",
            display: "flex",
            fontSize: 24,
            fontWeight: 800,
            gap: 16,
            position: "relative",
          }}
        >
          <span>overwhelmed</span>
          <span>angry</span>
          <span>heartbroken</span>
          <span>urgent</span>
          <span>ready</span>
        </div>
      </div>
    ),
    size,
  );
}
