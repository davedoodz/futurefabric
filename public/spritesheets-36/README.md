# 36-frame transparent product sprites

Fresh renders of the original 16 products plus the new Northface GLB (17 total), captured at 10-degree intervals around a complete turn. Open `index.html` for an interactive preview with product selection, horizontal dragging, arrow keys, automatic rotation, and dark/light/checkerboard backgrounds. The preview also works directly from disk.

## Assets

| Version | Frame size | Sheet size | WebP quality | Use |
| --- | --- | --- | --- | --- |
| Root folder | 768 × 768 | 4608 × 4608 | 90 | Detail views and larger product previews |
| `cards/` | 256 × 256 | 1536 × 1536 | 85 | Small cards and grids |

Both sizes contain 36 square frames in **6 columns × 6 rows**, ordered left-to-right, top-to-bottom. All sheets retain full-quality alpha transparency. WebP uses method 6 compression; metadata is stripped. The 1024px source renders are downsampled with Lanczos for smoother edges. Original PNG frames and source GLBs remain local rather than increasing repository size.

`manifest.json` records product filenames, image sizes, byte counts, angle spacing, and render settings. `manifest.js` supplies the same data to the standalone preview without requiring a server.

## Rendering

Blender 5.1.2 Cycles, NVIDIA OptiX GPU, 64 samples with adaptive sampling and denoising, AgX color transform, three large area lights, transparent film. Original GLB materials and textures are retained. A fixed orthographic camera framing per object prevents size changes between frames. The camera orbits around the vertical axis, beginning at -30° and advancing by 10°; the last frame is 320°, with no duplicate endpoint.

This folder is independent of the existing `/spritesheets/` set. To use these in the main app, change both the asset paths to `/spritesheets-36/` and the viewer's row count from 4 to 6. For the same rotational speed, multiply the old frame interval and drag distance per frame by 24/36. No main-app behavior is changed by this export.

## Rebuild

Requires Blender with Cycles/OptiX support, Node.js, and ImageMagick with WebP support. From the repository root:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.1\blender.exe' --factory-startup --background --python scripts/render_sprites.py -- 'PATH_TO_GLBS' 'PATH_TO_RENDER_OUTPUT'
node scripts/pack_sprites.mjs 'PATH_TO_RENDER_OUTPUT' public/spritesheets-36
```

Render output uses one directory per product with 36 RGBA PNGs. The renderer skips already completed directories; use a fresh render directory when changing settings. Add `--preview` to the Blender arguments to render only the first view of the first product.

Use `--only=northface` to render just that model. When adding a new model with unchanged render and packing settings, `--reuse` on the packer retains existing WebP files while rebuilding the manifest to include the new product.
