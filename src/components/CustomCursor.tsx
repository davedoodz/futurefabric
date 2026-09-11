import { useEffect, useRef } from "react";

interface Props {
  modal?: boolean;
}

/**
 * Follows the pointer with a small neutral circle. The full-size state is
 * reserved for the focused object itself, not the surrounding modal.
 */
export default function CustomCursor({ modal = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarsePointer) return;

    document.body.classList.add("has-custom-cursor");
    const el = ref.current;
    if (!el) return;

    const onMove = (event: PointerEvent) => {
      const hoveredObject = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest(".sprite-viewer--card, .sprite-viewer--focus");
      const size = hoveredObject ? 29 : 14.5;
      el.dataset.large = hoveredObject ? "true" : "false";
      el.style.transform = `translate3d(${event.clientX - size / 2}px, ${event.clientY - size / 2}px, 0)`;
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

  return (
    <div
      ref={ref}
      className={`custom-cursor${modal ? " custom-cursor--modal" : ""}`}
      aria-hidden="true"
    />
  );
}
