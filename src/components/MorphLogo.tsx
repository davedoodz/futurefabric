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

interface Props {
  size?: number | string;
  active?: boolean;
  onActivate?: () => void;
}

export default function MorphLogo({ size = 64, active = false, onActivate }: Props) {
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
      data-active={active}
      style={{ width: size, height: size }}
      onMouseEnter={() => !active && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate?.();
        }
      }}
      role={onActivate ? "button" : undefined}
      tabIndex={onActivate ? 0 : undefined}
      aria-label={onActivate ? "Toggle dark mode" : undefined}
      aria-pressed={onActivate ? active : undefined}
    >
      <svg className="morph-logo__svg" viewBox="0 0 64 64" width={size} height={size}>
        <path d={d} fill="#000000" />
      </svg>
      <span className="morph-logo__cluster" aria-hidden="true">
        <span className="morph-logo__circle morph-logo__circle--one" />
        <span className="morph-logo__circle morph-logo__circle--two" />
        <span className="morph-logo__circle morph-logo__circle--three" />
        <span className="morph-logo__circle morph-logo__circle--four" />
        <span className="morph-logo__circle morph-logo__circle--five" />
      </span>
    </span>
  );
}
