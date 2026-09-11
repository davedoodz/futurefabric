import { useDialKit } from "dialkit";

const POSITION_LIMIT = 100;

function useLogoPlacement(id: string, defaults: { x: number; y: number; scale: number }) {
  return useDialKit(
    id,
    {
      x: [defaults.x, -POSITION_LIMIT, POSITION_LIMIT, 1],
      y: [defaults.y, -POSITION_LIMIT, POSITION_LIMIT, 1],
      scale: [defaults.scale, 0.25, 4, 0.01],
    },
    { id: id.toLowerCase().replaceAll(" ", "-"), persist: true },
  );
}

export default function SponsorLogos() {
  const visibility = useDialKit(
    "MIT program logos",
    {
      designXVisible: true,
      artsVisible: true,
    },
    { id: "mit-program-logo-visibility", persist: true },
  );
  const designX = useLogoPlacement("MIT DesignX", { x: 100, y: 72, scale: 0.43 });
  const arts = useLogoPlacement("MIT Arts Startup Incubator", { x: 100, y: 72, scale: 0.25 });

  return (
    <div className="sponsor-logos" aria-label="MIT program logos">
      {visibility.designXVisible ? (
        <img
          className="sponsor-logo sponsor-logo--designx"
          src="/logos/mit-designx.png"
          alt="MIT DesignX"
          style={{ transform: `translate3d(${designX.x}vw, ${designX.y}vh, 0) scale(${designX.scale})` }}
        />
      ) : null}
      {visibility.artsVisible ? (
        <img
          className="sponsor-logo sponsor-logo--arts"
          src="/logos/mit-arts.png"
          alt="Arts at MIT — Startup Incubator"
          style={{ transform: `translate3d(${arts.x}vw, ${arts.y}vh, 0) scale(${arts.scale})` }}
        />
      ) : null}
    </div>
  );
}
