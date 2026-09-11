import { useCallback, useEffect, useRef, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";

const FRAME_COLUMNS = 6;
const FRAME_ROWS = 6;
const FRAME_COUNT = FRAME_COLUMNS * FRAME_ROWS;
const FRAME_INTERVAL_MS = 240;
const TICK_MIN_INTERVAL_MS = 16;
const DRAG_PIXELS_PER_FRAME = 8;
const DRAG_THRESHOLD_PX = 6;
const LONG_PRESS_MS = 300;
const BACKGROUND_SIZE = `${FRAME_COLUMNS * 100}% ${FRAME_ROWS * 100}%`;
const FRAME_POSITIONS = Array.from({ length: FRAME_COUNT }, (_, frame) => {
  const column = frame % FRAME_COLUMNS;
  const row = Math.floor(frame / FRAME_COLUMNS);
  return `${(column / (FRAME_COLUMNS - 1)) * 100}% ${(row / (FRAME_ROWS - 1)) * 100}%`;
});

const HIT_MASK_FRAME_SIZE = 128;
const HIT_ALPHA_THRESHOLD = 16;
const HIT_MASK_SHEET_SIZE = HIT_MASK_FRAME_SIZE * FRAME_COLUMNS;

interface SpriteHitMask {
  alpha: Uint8Array;
}

function fillEnclosedMaskHoles(alpha: Uint8Array) {
  const framePixels = HIT_MASK_FRAME_SIZE * HIT_MASK_FRAME_SIZE;
  const visited = new Uint8Array(framePixels);
  const queue = new Int32Array(framePixels);

  for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
    visited.fill(0);
    let readIndex = 0;
    let writeIndex = 0;
    const frameColumn = frame % FRAME_COLUMNS;
    const frameRow = Math.floor(frame / FRAME_COLUMNS);
    const offsetX = frameColumn * HIT_MASK_FRAME_SIZE;
    const offsetY = frameRow * HIT_MASK_FRAME_SIZE;

    const enqueueTransparentPixel = (x: number, y: number) => {
      const localIndex = y * HIT_MASK_FRAME_SIZE + x;
      if (visited[localIndex]) return;
      const sheetIndex = (offsetY + y) * HIT_MASK_SHEET_SIZE + offsetX + x;
      if (alpha[sheetIndex] >= HIT_ALPHA_THRESHOLD) return;
      visited[localIndex] = 1;
      queue[writeIndex] = localIndex;
      writeIndex += 1;
    };

    for (let position = 0; position < HIT_MASK_FRAME_SIZE; position += 1) {
      enqueueTransparentPixel(position, 0);
      enqueueTransparentPixel(position, HIT_MASK_FRAME_SIZE - 1);
      enqueueTransparentPixel(0, position);
      enqueueTransparentPixel(HIT_MASK_FRAME_SIZE - 1, position);
    }

    while (readIndex < writeIndex) {
      const localIndex = queue[readIndex];
      readIndex += 1;
      const x = localIndex % HIT_MASK_FRAME_SIZE;
      const y = Math.floor(localIndex / HIT_MASK_FRAME_SIZE);
      if (x > 0) enqueueTransparentPixel(x - 1, y);
      if (x + 1 < HIT_MASK_FRAME_SIZE) enqueueTransparentPixel(x + 1, y);
      if (y > 0) enqueueTransparentPixel(x, y - 1);
      if (y + 1 < HIT_MASK_FRAME_SIZE) enqueueTransparentPixel(x, y + 1);
    }

    for (let localIndex = 0; localIndex < framePixels; localIndex += 1) {
      if (visited[localIndex]) continue;
      const x = localIndex % HIT_MASK_FRAME_SIZE;
      const y = Math.floor(localIndex / HIT_MASK_FRAME_SIZE);
      const sheetIndex = (offsetY + y) * HIT_MASK_SHEET_SIZE + offsetX + x;
      if (alpha[sheetIndex] < HIT_ALPHA_THRESHOLD) alpha[sheetIndex] = 255;
    }
  }
}

const spriteHitMaskCache = new Map<string, Promise<SpriteHitMask | null>>();

function loadSpriteHitMask(src: string) {
  const cached = spriteHitMaskCache.get(src);
  if (cached) return cached;

  const pending = new Promise<SpriteHitMask | null>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = HIT_MASK_SHEET_SIZE;
        canvas.height = HIT_MASK_SHEET_SIZE;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) {
          resolve(null);
          return;
        }

        context.drawImage(image, 0, 0, HIT_MASK_SHEET_SIZE, HIT_MASK_SHEET_SIZE);
        const rgba = context.getImageData(0, 0, HIT_MASK_SHEET_SIZE, HIT_MASK_SHEET_SIZE).data;
        const alpha = new Uint8Array(HIT_MASK_SHEET_SIZE * HIT_MASK_SHEET_SIZE);
        for (let pixel = 0, channel = 3; pixel < alpha.length; pixel += 1, channel += 4) {
          alpha[pixel] = rgba[channel];
        }
        fillEnclosedMaskHoles(alpha);
        resolve({ alpha });
      } catch {
        resolve(null);
      }
    };
    image.onerror = () => resolve(null);
    image.src = src;
  });

  spriteHitMaskCache.set(src, pending);
  return pending;
}

function maskContainsPoint(mask: SpriteHitMask, frame: number, x: number, y: number) {
  if (x < 0 || x >= 1 || y < 0 || y >= 1) return false;
  const frameColumn = frame % FRAME_COLUMNS;
  const frameRow = Math.floor(frame / FRAME_COLUMNS);
  const maskX = frameColumn * HIT_MASK_FRAME_SIZE + Math.floor(x * HIT_MASK_FRAME_SIZE);
  const maskY = frameRow * HIT_MASK_FRAME_SIZE + Math.floor(y * HIT_MASK_FRAME_SIZE);
  return mask.alpha[maskY * HIT_MASK_SHEET_SIZE + maskX] >= HIT_ALPHA_THRESHOLD;
}

type FrameSubscriber = () => void;

const frameSubscribers = new Set<FrameSubscriber>();
let frameTimer: number | null = null;
let rotationSpeed = 1;

function restartFrameTicker() {
  if (frameTimer !== null) {
    window.clearInterval(frameTimer);
    frameTimer = null;
  }
  if (frameSubscribers.size > 0 && rotationSpeed > 0) {
    frameTimer = window.setInterval(() => {
      for (const callback of frameSubscribers) callback();
    }, Math.max(TICK_MIN_INTERVAL_MS, FRAME_INTERVAL_MS / rotationSpeed));
  }
}

export function setRotationSpeed(speed: number) {
  rotationSpeed = Math.max(0, speed);
  restartFrameTicker();
}

function subscribeToFrameTicker(subscriber: FrameSubscriber) {
  frameSubscribers.add(subscriber);
  restartFrameTicker();

  return () => {
    frameSubscribers.delete(subscriber);
    if (frameSubscribers.size === 0) restartFrameTicker();
  };
}

interface Props {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  paused?: boolean;
  grabEnabled?: boolean;
  onActivate?: () => void;
  transform?: string;
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
  grabEnabled = true,
  onActivate,
  transform,
}: Props) {
  const elementRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef(0);
  const paintedFrameRef = useRef(-1);
  const dragStartRef = useRef<DragStart | null>(null);
  const draggedRef = useRef(false);
  const heldRef = useRef(false);
  const pausedRef = useRef(paused);
  const grabEnabledRef = useRef(grabEnabled);
  const hitMaskRef = useRef<SpriteHitMask | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  const setPixelHover = useCallback((active: boolean) => {
    const element = elementRef.current;
    if (!element || element.dataset.pixelHover === String(active)) return;
    element.dataset.pixelHover = String(active);
    document.body.classList.toggle("has-pixel-hover", active);
  }, []);

  const updatePixelHover = useCallback((clientX: number, clientY: number) => {
    const element = elementRef.current;
    const mask = hitMaskRef.current;
    if (!element || !mask) {
      setPixelHover(false);
      return;
    }

    const bounds = element.getBoundingClientRect();
    const x = (clientX - bounds.left) / bounds.width;
    const y = (clientY - bounds.top) / bounds.height;
    setPixelHover(maskContainsPoint(mask, frameRef.current, x, y));
  }, [setPixelHover]);

  useEffect(() => {
    grabEnabledRef.current = grabEnabled;
    if (!grabEnabled) {
      dragStartRef.current = null;
      draggedRef.current = false;
      heldRef.current = false;
    }
  }, [grabEnabled]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const renderFrame = useCallback((frame: number) => {
    const normalizedFrame = ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    frameRef.current = normalizedFrame;
    if (paintedFrameRef.current === normalizedFrame) return;

    paintedFrameRef.current = normalizedFrame;
    elementRef.current?.style.setProperty("background-position", FRAME_POSITIONS[normalizedFrame]);
    const pointer = pointerRef.current;
    if (pointer) updatePixelHover(pointer.x, pointer.y);
  }, [updatePixelHover]);

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
        if (!pausedRef.current && dragStartRef.current === null) {
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
      void loadSpriteHitMask(src).then((mask) => {
        if (!loaded) return;
        hitMaskRef.current = mask;
        const pointer = pointerRef.current;
        if (pointer) updatePixelHover(pointer.x, pointer.y);
      });
      subscribe();
    };

    const unload = () => {
      if (!loaded) return;
      loaded = false;
      unsubscribeIfSubscribed();
      element.style.backgroundImage = "";
      paintedFrameRef.current = -1;
      hitMaskRef.current = null;
      setPixelHover(false);
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
        { rootMargin: "100px 0px" },
      );
      observer.observe(element);
    }

    return () => {
      observer?.disconnect();
      unsubscribeIfSubscribed();
      pointerRef.current = null;
      hitMaskRef.current = null;
      setPixelHover(false);
    };
  }, [eager, renderFrame, setPixelHover, src, updatePixelHover]);
  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (
      !grabEnabledRef.current ||
      event.button !== 0 ||
      (event.pointerType === "mouse" && event.currentTarget.dataset.pixelHover !== "true")
    ) return;
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
    if (event.pointerType === "mouse") {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      updatePixelHover(event.clientX, event.clientY);
    }
    if (!grabEnabledRef.current) return;
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

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (
      event.detail !== 0 &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      event.currentTarget.dataset.pixelHover !== "true"
    ) return;
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
      style={{ backgroundSize: BACKGROUND_SIZE, transform }}
      aria-label={onActivate ? `View ${alt} full screen` : `Drag to rotate ${alt}`}
      data-pixel-hover="false"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        pointerRef.current = { x: event.clientX, y: event.clientY };
        updatePixelHover(event.clientX, event.clientY);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        pointerRef.current = null;
        setPixelHover(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClick={handleClick}
    />
  );
}
