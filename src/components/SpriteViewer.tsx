import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

const FRAME_COLUMNS = 6;
const FRAME_ROWS = 4;
const FRAME_COUNT = FRAME_COLUMNS * FRAME_ROWS;
const FRAME_INTERVAL_MS = 360;
const DRAG_PIXELS_PER_FRAME = 12;
const DRAG_THRESHOLD_PX = 6;
const LONG_PRESS_MS = 300;
const BACKGROUND_SIZE = `${FRAME_COLUMNS * 100}% ${FRAME_ROWS * 100}%`;
const FRAME_POSITIONS = Array.from({ length: FRAME_COUNT }, (_, frame) => {
  const column = frame % FRAME_COLUMNS;
  const row = Math.floor(frame / FRAME_COLUMNS);
  return `${(column / (FRAME_COLUMNS - 1)) * 100}% ${(row / (FRAME_ROWS - 1)) * 100}%`;
});

type FrameSubscriber = () => void;

const frameSubscribers = new Set<FrameSubscriber>();
let frameTimer: number | null = null;

function subscribeToFrameTicker(subscriber: FrameSubscriber) {
  frameSubscribers.add(subscriber);
  if (frameTimer === null) {
    frameTimer = window.setInterval(() => {
      for (const callback of frameSubscribers) callback();
    }, FRAME_INTERVAL_MS);
  }

  return () => {
    frameSubscribers.delete(subscriber);
    if (frameSubscribers.size === 0 && frameTimer !== null) {
      window.clearInterval(frameTimer);
      frameTimer = null;
    }
  };
}

interface Props {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  paused?: boolean;
  onActivate?: () => void;
}

interface DragStart {
  pointerId: number;
  x: number;
  frame: number;
  startedAt: number;
}

export default function SpriteViewer({
  src,
  alt,
  className = "",
  eager = false,
  paused = false,
  onActivate,
}: Props) {
  const elementRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef(0);
  const paintedFrameRef = useRef(-1);
  const dragStartRef = useRef<DragStart | null>(null);
  const draggedRef = useRef(false);
  const heldRef = useRef(false);
  const hoveredRef = useRef(false);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const renderFrame = useCallback((frame: number) => {
    const normalizedFrame = ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    frameRef.current = normalizedFrame;
    if (paintedFrameRef.current === normalizedFrame) return;

    paintedFrameRef.current = normalizedFrame;
    elementRef.current?.style.setProperty("background-position", FRAME_POSITIONS[normalizedFrame]);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    frameRef.current = 0;
    paintedFrameRef.current = -1;
    renderFrame(0);

    let unsubscribe = () => {};
    let observer: IntersectionObserver | null = null;
    let loaded = false;
    let subscribed = false;

    const subscribe = () => {
      if (subscribed) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      subscribed = true;
      unsubscribe = subscribeToFrameTicker(() => {
        if (!pausedRef.current && !hoveredRef.current && dragStartRef.current === null) {
          renderFrame(frameRef.current + 1);
        }
      });
    };

    const unsubscribeIfSubscribed = () => {
      if (!subscribed) return;
      subscribed = false;
      unsubscribe();
      unsubscribe = () => {};
    };

    const load = () => {
      if (loaded) return;
      loaded = true;
      element.style.backgroundImage = `url("${src}")`;
      paintedFrameRef.current = -1;
      renderFrame(frameRef.current);
      subscribe();
    };

    const unload = () => {
      if (!loaded) return;
      loaded = false;
      unsubscribeIfSubscribed();
      element.style.backgroundImage = "";
      paintedFrameRef.current = -1;
    };

    if (eager || !("IntersectionObserver" in window)) {
      load();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            load();
          } else {
            unload();
          }
        },
        { rootMargin: "400px" },
      );
      observer.observe(element);
    }

    return () => {
      observer?.disconnect();
      unsubscribeIfSubscribed();
    };
  }, [eager, renderFrame, src]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    draggedRef.current = false;
    heldRef.current = false;
    dragStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      frame: frameRef.current,
      startedAt: event.timeStamp,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragStart.x;
    if (Math.abs(deltaX) >= DRAG_THRESHOLD_PX) draggedRef.current = true;
    renderFrame(dragStart.frame - Math.trunc(deltaX / DRAG_PIXELS_PER_FRAME));
  };

  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;
    heldRef.current = event.timeStamp - dragStart.startedAt >= LONG_PRESS_MS;
    dragStartRef.current = null;
  };

  const handleClick = () => {
    if (draggedRef.current || heldRef.current) {
      draggedRef.current = false;
      heldRef.current = false;
      return;
    }
    onActivate?.();
  };

  return (
    <button
      ref={elementRef}
      type="button"
      className={`sprite-viewer ${className}`}
      style={{ backgroundSize: BACKGROUND_SIZE }}
      aria-label={onActivate ? `View ${alt} full screen` : `Drag to rotate ${alt}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoveredRef.current = true;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") hoveredRef.current = false;
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClick={handleClick}
    />
  );
}
