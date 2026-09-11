import { useEffect, useRef } from "react";
import type { PointerEvent, MouseEvent } from "react";
import type { Product } from "../data/products";
import { materialChemistry, molecules } from "../data/materialChemistry";

const ELEMENTS: Record<number, { label: string; radius: number; shade: string }> = {
  1: { label: "H", radius: 0.22, shade: "#aaa" },
  6: { label: "C", radius: 0.39, shade: "#eee" },
  7: { label: "N", radius: 0.38, shade: "#777" },
  8: { label: "O", radius: 0.36, shade: "#333" },
};

interface Props {
  product: Product;
  paused?: boolean;
  focus?: boolean;
  zoom?: number;
  interactive?: boolean;
  onActivate?: (source: HTMLButtonElement) => void;
}

export default function MoleculeViewer({ product, paused = false, focus = false, zoom = 1, interactive = false, onActivate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef({ active: false, moved: false, x: 0 });
  const chemistry = materialChemistry(product);
  const model = molecules[chemistry.model];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let angle = 0.45;
    let width = 220;
    let height = 220;
    let pixelRatio = 1;
    const center = [0, 0, 0];
    for (const atom of model.atoms) for (let axis = 0; axis < 3; axis++) center[axis] += atom[axis + 1] / model.atoms.length;
    const atoms = model.atoms.map(([element, x, y, z]) => ({ element, x: x - center[0], y: y - center[1], z: z - center[2] }));
    const radius = Math.max(...atoms.map(atom => Math.hypot(atom.x, atom.y, atom.z))) + 0.7;
    const projected = atoms.map(() => ({ x: 0, y: 0, z: 0, scale: 1 }));
    const primitives = [
      ...atoms.map((_, index) => ({ kind: "atom" as const, index, depth: 0 })),
      ...model.bonds.map((_, index) => ({ kind: "bond" as const, index, depth: 0 })),
    ];
    // Cache shaded spheres; each animation frame only projects and composites.
    const spheres: Record<number, HTMLCanvasElement> = {};
    for (const [key, element] of Object.entries(ELEMENTS)) {
      const sphere = document.createElement("canvas");
      sphere.width = sphere.height = 64;
      const brush = sphere.getContext("2d")!;
      const shade = brush.createRadialGradient(22, 18, 2, 32, 32, 30);
      shade.addColorStop(0, "#fff");
      shade.addColorStop(0.35, element.shade);
      shade.addColorStop(1, "#111");
      brush.fillStyle = shade;
      brush.beginPath(); brush.arc(32, 32, 30, 0, Math.PI * 2); brush.fill();
      brush.strokeStyle = "#bbb"; brush.lineWidth = 1; brush.stroke();
      spheres[Number(key)] = sphere;
    }
    const draw = () => {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const unit = Math.min(width, height) * 0.48 / radius * zoom;
      const cosine = Math.cos(angle), sine = Math.sin(angle);
      const tilt = 0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
      atoms.forEach((atom, index) => {
        const x = atom.x * cosine + atom.z * sine;
        const z = -atom.x * sine + atom.z * cosine;
        const y = atom.y * ct - z * st;
        const depth = atom.y * st + z * ct;
        const perspective = 1 / (1 - depth / (radius * 5));
        const point = projected[index];
        point.x = width / 2 + x * unit * perspective;
        point.y = height * 0.46 + y * unit * perspective;
        point.z = depth;
        point.scale = unit * perspective;
      });
      for (const primitive of primitives) {
        if (primitive.kind === "atom") primitive.depth = projected[primitive.index].z;
        else {
          const [a, b] = model.bonds[primitive.index];
          primitive.depth = (projected[a].z + projected[b].z) / 2;
        }
      }
      primitives.sort((a, b) => a.depth - b.depth);
      ctx.lineCap = "round";
      for (const primitive of primitives) {
        ctx.globalAlpha = 0.65 + 0.35 * (primitive.depth + radius) / (radius * 2);
        if (primitive.kind === "bond") {
          const [a, b, order] = model.bonds[primitive.index];
          const start = projected[a], end = projected[b];
          const direction = Math.atan2(end.y - start.y, end.x - start.x);
          for (let bond = 0; bond < order; bond++) {
            const offset = (bond - (order - 1) / 2) * unit * 0.14;
            const dx = -Math.sin(direction) * offset, dy = Math.cos(direction) * offset;
            ctx.beginPath(); ctx.moveTo(start.x + dx, start.y + dy); ctx.lineTo(end.x + dx, end.y + dy);
            ctx.strokeStyle = "#777"; ctx.lineWidth = Math.max(1, unit * 0.11); ctx.stroke();
            ctx.strokeStyle = "#ddd"; ctx.lineWidth = Math.max(0.5, unit * 0.035); ctx.stroke();
          }
        } else {
          const atom = atoms[primitive.index], point = projected[primitive.index];
          const element = ELEMENTS[atom.element];
          const r = element.radius * point.scale;
          ctx.drawImage(spheres[atom.element], point.x - r, point.y - r, r * 2, r * 2);
          if (atom.element !== 1 && r > 5) {
            ctx.fillStyle = atom.element === 6 ? "#222" : "#fff";
            ctx.font = `${Math.max(6, r * 0.9)}px monospace`;
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(element.label, point.x, point.y);
          }
        }
      }
      ctx.globalAlpha = 1;
    };
    const tick = (time: number) => {
      angle += lastTime ? Math.min(time - lastTime, 50) * 0.00024 : 0;
      lastTime = time;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      lastTime = 0;
      draw();
      if (visible && !document.hidden && !paused && !reduced.matches) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      pixelRatio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      update();
    });
    resize.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    intersection.observe(canvas);
    const rotate = (event: Event) => { angle += (event as CustomEvent<number>).detail * 0.012; draw(); };
    canvas.addEventListener("molecule:rotate", rotate);
    reduced.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect(); intersection.disconnect();
      canvas.removeEventListener("molecule:rotate", rotate);
      reduced.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [model, paused, zoom]);
  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    dragRef.current = { active: true, moved: false, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.active) return;
    if (Math.abs(event.clientX - dragRef.current.x) > 3) dragRef.current.moved = true;
    dragRef.current.x = event.clientX;
    canvasRef.current?.dispatchEvent(new CustomEvent("molecule:rotate", { detail: event.movementX }));
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (dragRef.current.moved) { dragRef.current.moved = false; return; }
    onActivate?.(event.currentTarget);
  };
  return (
    <div className={`molecule-viewer${focus ? " molecule-viewer--focus" : ""}`} data-model={chemistry.model}>
      <button
        type="button"
        className="molecule-viewer__object"
        disabled={!onActivate && !interactive}
        aria-label={`${chemistry.modelLabel.toLowerCase()}, representative 3D structure for ${product.name}${onActivate ? "; open full screen" : ""}`}
        onPointerDown={(event: PointerEvent<HTMLButtonElement>) => handlePointerDown(event)}
        onPointerMove={(event: PointerEvent<HTMLButtonElement>) => handlePointerMove(event)}
        onPointerUp={(event: PointerEvent<HTMLButtonElement>) => handlePointerUp(event)}
        onPointerCancel={(event: PointerEvent<HTMLButtonElement>) => handlePointerUp(event)}
        onClick={(event: MouseEvent<HTMLButtonElement>) => handleClick(event)}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </button>
      {!focus ? <><span className="molecule-viewer__caption">{chemistry.modelLabel}</span><span className="molecule-viewer__legend">C · H · O{chemistry.model === "chitin" || chemistry.model === "peptide" ? " · N" : ""} / 3D CONFORMER</span></> : null}
    </div>
  );
}
