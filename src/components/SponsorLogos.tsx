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
  const designX = useLogoPlacement("MIT DesignX", { x: 8, y: 72, scale: 1 });
  const arts = useLogoPlacement("MIT Arts Startup Incubator", { x: 68, y: 72, scale: 0.48 });

  return (
    <div className="sponsor-logos" aria-label="MIT program logos">
      <img
        className="sponsor-logo sponsor-logo--designx"
        src="/logos/mit-designx.png"
        alt="MIT DesignX"
        style={{ transform: `translate3d(${designX.x}vw, ${designX.y}vh, 0) scale(${designX.scale})` }}
      />
      <img
        className="sponsor-logo sponsor-logo--arts"
        src="/logos/mit-arts.png"
        alt="Arts at MIT — Startup Incubator"
        style={{ transform: `translate3d(${arts.x}vw, ${arts.y}vh, 0) scale(${arts.scale})` }}
      />
    </div>
  );
}
