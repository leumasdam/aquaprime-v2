import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {PRODUCTS} from '../app/products.ts';
import {dvierkaPreSirku,cabinetSurfaces} from '../app/cabinet-construction.ts';
import {dvierkaFotky} from './foto-dvierka.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
assert.equal(dvierkaPreSirku(119),2);
for(const width of [120,150,160,180,199])assert.equal(dvierkaPreSirku(width),3);
for(const width of [200,220,250])assert.equal(dvierkaPreSirku(width),4);
assert.equal(dvierkaFotky('/img/products/unclassified-01.webp'),null);
let galleries=0,photos=0,leds=0,schematics=0,borrowed=0,missing=0;
const unique=new Set();
for(const p of PRODUCTS){
 const expected=dvierkaPreSirku(p.w);
 assert.equal(p.cover,p.decors[0].images[0],`${p.slug}: cover differs from gallery`);
 for(const d of p.decors){
  galleries++;
  // Dekor, ktorý rad ponúka, ale pri tomto rozmere ho nemáme nafotený.
  // Galéria je prázdna zámerne — na webe stojí namiesto fotky placeholder.
  // Prvý dekor ním byť nesmie, z neho je titulná fotka produktu.
  if(d.chyba){
   missing++;
   assert.equal(d.images.length,0,`${p.slug}/${d.id}: decor marked chyba but has photos`);
   assert.ok(!d.led,`${p.slug}/${d.id}: decor marked chyba but has LED photos`);
   assert.notEqual(d,p.decors[0],`${p.slug}/${d.id}: cover decor cannot be missing photos`);
   continue;
  }
  assert.ok(d.images.length,`${p.slug}/${d.id}: empty gallery`);
  // Dekor nafotený len v inom počte dvierok je dovolený, ale musí byť
  // označený (illuDvierka) a všetky jeho fotky musia sedieť s tým štítkom.
  const labelled=d.illuFrom==='dvierka';
  if(labelled){
   borrowed++;
   assert.ok(d.inherited&&d.illuDvierka&&d.illuDvierka!==expected,`${p.slug}/${d.id}: door-count label without a real mismatch`);
   // basic smie požičať rám s iným počtom polí, ale stále len basic fotku — to stráži kontrola prefixu nižšie
  }
  const allowed=labelled?d.illuDvierka:expected;
  assert.equal(dvierkaFotky(d.images[0]),allowed,`${p.slug}/${d.id}: wrong cover`);
  for(const image of [...d.images,...Object.values(d.led??{}).flat()]){
   const actual=dvierkaFotky(image);
   const want=image.includes('/led/')?expected:allowed;
   assert.ok(actual===0||actual===want,`${p.slug}/${d.id}: ${image} has ${actual}, expected ${want}`);
   assert.ok(fs.existsSync(path.join(root,'public',image)),`Missing ${image}`);
   unique.add(image);
   if(image.includes('/led/'))leds++;else if(image.endsWith('.svg')){
    schematics++;
    const svg=fs.readFileSync(path.join(root,'public',image),'utf8');
    assert.ok(svg.includes(`data-panels="${expected}"`));
    assert.equal((svg.match(/data-door=/g)||[]).length,p.tier==='basic'?0:expected);
    assert.ok(!svg.includes('href="/'),'SVG textures must be embedded');
    assert.equal(d.illuFrom,'schema');
   }else { photos++;if(p.tier==='basic')assert.ok(image.startsWith('/img/products/basic-')); }
  }
 }
}
const surfaces=cabinetSurfaces({id:'dub-spanielsky-black-matt',swatch:['wood','black']});
assert.deepEqual(surfaces,{doors:'black',body:'wood'});
console.log(`PASS: ${PRODUCTS.length} products, ${galleries} decor galleries, ${photos} photo references, ${leds} LED references, ${schematics} labelled schematics, ${borrowed} labelled other-door-count galleries, ${missing} decors awaiting photos, ${unique.size} unique assets. No mismatched or unknown panel counts.`);
