import { useEffect, useMemo, useRef, useState } from "react";
import { interpolate } from "flubber";
import { trianglePath, roundedSquarePath, circlePath } from "../lib/shapes";

// Hover: triangle -> rounded square -> circle. Unhover: circle -> rounded
// square -> triangle, same easing, played backwards (not just snapped).
const STAGE_MS = 420;
const TOTAL_MS = STAGE_MS * 2;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function MorphLogo({ size = 64 }: { size?: number | string }) {
  const [hovered, setHovered] = useState(false);
  const [d, setD] = useState(trianglePath());
  const progress = useRef(0); // 0 = triangle, 1 = rounded square, 2 = circle
  const raf = useRef<number | null>(null);

  const toRounded = useMemo(
    () => interpolate(trianglePath(), roundedSquarePath(20), { maxSegmentLength: 2 }),
    [],
  );
  const toCircle = useMemo(
    () => interpolate(roundedSquarePath(20), circlePath(), { maxSegmentLength: 2 }),
    [],
  );

  useEffect(() => {
    const target = hovered ? 2 : 0;
    const start = progress.current;
    const distance = Math.abs(target - start);
    if (distance < 0.0005) return;
    const duration = TOTAL_MS * (distance / 2);
    const startTime = performance.now();

    if (raf.current) cancelAnimationFrame(raf.current);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);
      const value = start + (target - start) * eased;
      progress.current = value;
      setD(value <= 1 ? toRounded(Math.max(0, Math.min(1, value))) : toCircle(Math.max(0, Math.min(1, value - 1))));
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [hovered, toRounded, toCircle]);

  return (
    <span
      className="morph-logo"
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <path d={d} fill="#000000" />
      </svg>
    </span>
  );
}
