import { useEffect, useRef } from "react";

/**
 * Gray circle, white stroke, 50% opacity fill — matches the cursor token
 * pulled from the Paper file (#DDDDDD @ 50% + 1px solid white outline).
 * Follows the pointer anywhere inside the app; hidden on touch input.
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarsePointer) return;

    document.body.classList.add("has-custom-cursor");
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX - 14.5}px, ${e.clientY - 14.5}px, 0)`;
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="custom-cursor" aria-hidden="true" />;
}
