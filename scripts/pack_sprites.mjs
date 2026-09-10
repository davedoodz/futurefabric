// node scripts/pack_sprites.mjs RENDER_DIRECTORY [OUTPUT_DIRECTORY]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const source = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3] || 'public/spritesheets-36');
fs.mkdirSync(path.join(output, 'cards'), { recursive: true });
const products = [];
const wait = process.argv.includes('--wait');
const only = process.argv.find(arg => arg.startsWith('--only='))?.split('=')[1];
const directories = wait
  ? fs.readdirSync(path.join(output,'..','spritesheets')).filter(n => n.endsWith('-spritesheet.webp')).map(n => n.replace('-spritesheet.webp','')).sort()
  : fs.readdirSync(source).filter(n => fs.statSync(path.join(source,n)).isDirectory()).sort();
for (const dir of directories) {
  if (only && dir !== only) continue;
  const folder = path.join(source, dir);
  const frames = Array.from({length:36}, (_, i) => path.join(folder, `frame-${String(i).padStart(2,'0')}.png`));
  const complete = () => frames.every(file => fs.existsSync(file)) && fs.existsSync(path.join(folder,'source.json'));
  const deadline = Date.now() + 30 * 60 * 1000;
  while(wait && !complete() && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve,1000));
  if (!frames.every(file => fs.existsSync(file))) throw new Error(`Incomplete frames: ${dir}`);
  const meta = JSON.parse(fs.readFileSync(path.join(folder, 'source.json'), 'utf8'));
  const name = `${dir}-spritesheet.webp`;
  for (const [size, quality, destination] of [[768,90,path.join(output,name)], [256,85,path.join(output,'cards',name)]]) {
    if (process.argv.includes('--reuse') && fs.existsSync(destination)) continue;
    execFileSync('magick', ['montage', ...frames, '-filter','Lanczos','-geometry',`${size}x${size}+0+0`,
      '-tile','6x6','-background','none','-strip','-define','webp:method=6','-define','webp:alpha-quality=100',
      '-quality',String(quality),destination], {stdio:'inherit'});
  }
  products.push({id:dir, name:meta.source.replace(/\.glb$/i,''), source:meta.source, src:name,
    cardSrc:`cards/${name}`, bytes:fs.statSync(path.join(output,name)).size,
    cardBytes:fs.statSync(path.join(output,'cards',name)).size});
  console.log(`PACKED ${dir}`, products.at(-1).bytes, products.at(-1).cardBytes);
}
const manifest = {version:1,columns:6,rows:6,frameCount:36,stepDegrees:10,firstCameraDegrees:-30,
  frameOrder:'row-major',transparent:true,full:{frameWidth:768,frameHeight:768,width:4608,height:4608,quality:90},
  cards:{frameWidth:256,frameHeight:256,width:1536,height:1536,quality:85},
  render:{engine:'Blender Cycles',samples:64,sourceFrameSize:1024,denoised:true,colorTransform:'AgX'},products};
if (!only) {
  fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  // Same-directory demo also works when opened directly from disk.
  fs.writeFileSync(path.join(output,'manifest.js'),'window.SPRITE_MANIFEST = '+JSON.stringify(manifest)+';\n');
}
console.log(`DONE: ${products.length} products / ${products.length*36} unique rendered views`);
