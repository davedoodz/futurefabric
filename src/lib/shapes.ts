// Path builders for the FutureFabric mark. All three keyframes are drawn
// inside the same 64x64 box so flubber can interpolate smoothly between
// them (triangle -> rounded square -> circle) in both directions.

const BOX = 64;

/** Right triangle matching the Paper SVG (flat right + bottom edges, hypotenuse top-right -> bottom-left). */
export function trianglePath(): string {
  return `M${BOX},0 L0,${BOX} L${BOX},${BOX} Z`;
}

/** Rounded square/superellipse-ish rect with corner radius r. */
export function roundedSquarePath(r: number): string {
  const s = BOX;
  return [
    `M${r},0`,
    `L${s - r},0`,
    `A${r},${r} 0 0 1 ${s},${r}`,
    `L${s},${s - r}`,
    `A${r},${r} 0 0 1 ${s - r},${s}`,
    `L${r},${s}`,
    `A${r},${r} 0 0 1 0,${s - r}`,
    `L0,${r}`,
    `A${r},${r} 0 0 1 ${r},0`,
    "Z",
  ].join(" ");
}

/** Full circle inscribed in the box. */
export function circlePath(): string {
  const c = BOX / 2;
  return `M${c},0 A${c},${c} 0 1 1 ${c - 0.01},0 Z`;
}
