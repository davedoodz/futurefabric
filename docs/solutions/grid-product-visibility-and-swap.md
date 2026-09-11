---
title: Persist per-product visibility and drag-swap state
date: 2026-09-11
category: solutions
author: OMP
module: Product catalog grid
problem_type: ui_bug
component: frontend
severity: medium
symptoms:
  - Product drag gestures did not swap cards
  - There was no per-product way to hide a card
root_cause: logic_error
resolution_type: code_fix
tags:
  - product-grid
  - dialkit
  - drag-drop
  - visibility
  - persistence
---

# Persist per-product visibility and drag-swap state

## Problem
The FutureFabric catalog needed editor controls to hide individual products and reorder products by dragging. The drag interaction appeared available, but the dragged product identifier was never set, so dropping could not swap the cards.

## Symptoms
- Product cards did not change order after dragging.
- Product-specific DialKit panels had no visibility control.

## What Didn't Work
- The grid already persisted an order array, but persistence alone could not work because the drag source handler was missing.
- Hiding only the image would leave an incomplete product card; visibility must remove the whole card from the grid.

## Solution
Add a `visible` boolean to each product's persisted DialKit placement control and return `null` from `ProductCard` when it is false. Keep the hook call before the conditional return.

```tsx
const placement = useProductPlacement(product);
if (!placement.visible) return null;
```

The drag source must set the active code. The drop target then swaps the two products and writes the category order to local storage; the existing shared-layout debounce uploads that value to Vercel Blob.

```tsx
<ProductCard
  draggable
  onDragStart={() => setDraggedCode(product.code)}
  onDragEnd={() => setDraggedCode(null)}
  onDragOver={(event) => event.preventDefault()}
  onDrop={() => swapProducts(product.code)}
/>
```

## Why This Works
`draggedCode` identifies the source independently of the target. The swap updater can therefore locate both products, exchange their array positions, and persist the resulting code list. The shared layout hydrates the same key before the app mounts, so visibility and order survive reloads and devices.

## Prevention
- When adding drag-and-drop, verify the complete lifecycle: `dragstart`, `dragover`, `drop`, and `dragend`.
- Test both the observable grid state and the persisted storage payload after a swap.
- Treat per-product editor booleans as persisted placement state, not ad hoc component state.

## Related
- `src/components/ProductCard.tsx`
- `src/components/ProductGrid.tsx`
- `src/lib/layoutPersistence.ts`
