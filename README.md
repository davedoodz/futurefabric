# FutureFabric

```
      .  *  .    ~  biomaterial catalog  ~    .  *  .
          __
       .-'  `-.        /\    cellulose
      /  o    o \      \/      |
     |    __      |    /\    chitin
      \  '--'    /     \/      |
       `-.____.-'      /\    protein
        ./||\.          \/
```

An open-source catalog of bio-based fashion apparel — real garments, real brands, real material chemistry, browsable as an interactive sprite-animated grid.

**[Live](https://futurefabric-beryl.vercel.app)**

## What it is

FutureFabric catalogs fashion pieces made from plant, protein, microbial, and bio-synthetic materials — from Balenciaga's mycelium-leather coat to Nike × Piñatex sneakers to Stella McCartney's lab-grown Mylo bustier. Every product card is an animated sprite turntable, not a static photo, and clicking through opens a molecular model of the material's underlying chemistry (cellulose, chitin, polypeptide) rendered live on canvas.

Products are grouped into four categories:

- Plant-based cellulosic
- Protein-based
- Bio-based synthetic polymers
- Microbial and fungal bioassembled

## Highlights

- **Sprite turntables.** Each product ships as a 6×6 spritesheet (36 frames); `SpriteViewer` drives rotation speed and direction, tunable live via DialKit.
- **Material chemistry viewer.** `MoleculeViewer` renders a representative PubChem 3D conformer (cellobiose, glycylglycine, chitin unit, etc.) on an interactive canvas per material class.
- **Editable layout that persists.** Grid order, per-product visibility, and typography are all DialKit-controlled and saved to Vercel Blob via a small serverless API (`api/layout.ts`), so edits survive reloads and devices.
- **Drag-to-reorder, click-to-hide.** The catalog grid supports drag-and-drop reordering and per-card visibility toggles, both persisted.
- **Sourced research.** `research_product_links/` and `research_product_titles/` document how official product names and source links were verified against brand and material-maker pages.

## Stack

React 19, TypeScript, Vite, [DialKit](https://www.npmjs.com/package/dialkit) for live-tunable UI controls, `flubber` for shape morphing, `@vercel/blob` for shared layout persistence, Oxlint for linting. Sprites are built with a Python/Node pipeline (`scripts/render_sprites.py`, `scripts/pack_sprites.mjs`).

## Run locally

```sh
npm install
npm run dev       # start the Vite dev server
npm run build      # typecheck + production build
npm run preview    # preview the production build
npm run lint        # oxlint
```

## Map of the repo

| Path | What's there |
| --- | --- |
| `src/components/` | Header, ProductGrid, ProductCard, SpriteViewer, MoleculeViewer, MaterialScan, CategoryTabs, custom cursor |
| `src/data/` | Product catalog, material chemistry, and molecule geometry (`molecules.json`) |
| `src/lib/` | Editable-copy provider and shared-layout persistence client |
| `api/layout.ts` | Vercel serverless route backing shared layout storage |
| `scripts/` | Spritesheet rendering (Python) and packing (Node) pipeline |
| `research_product_links/`, `research_product_titles/` | Research notes verifying product names and sources |
| `docs/solutions/` | Dev notes on specific bugs and fixes |
