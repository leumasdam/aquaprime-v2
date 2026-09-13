/** Strict photo assignment: never reuse a different number of cabinet panels.
 * node scripts/prirad-fotky.mjs [--zapis]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS } from '../app/products.ts';
import { dvierkaFotky, dvierkaPreSirku, jeOtvorena, jeCelna } from './foto-dvierka.mjs';
import { schematic } from './cabinet-schematic.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'app/products.ts');
const folder=path.join(root,'public/img/products');
const write=process.argv.includes('--zapis');
const basename=f=>f.replace('/img/products/','').replace(/-\d+\.webp$/,'');
const sets={};
for(const name of fs.readdirSync(folder).sort()){
 if(!/^.+-\d+\.webp$/.test(name))continue;
 const url=`/img/products/${name}`;
 (sets[basename(url)]??=[]).push(url);
}
const decorIds=[...new Set(PRODUCTS.flatMap(p=>p.decors.map(d=>d.id)))].sort((a,b)=>b.length-a.length);
const decorSets={};
// Derive from source filenames, not rewritten galleries, so repeating the import is stable.
for(const set of Object.keys(sets)){
 const id=set.startsWith('basic-')?'ram':decorIds.find(id=>set===id||set.endsWith(`-${id}`));
 if(id)(decorSets[id]??=new Set()).add(set);
}
const source=f=>{
 const match=basename(f).match(/^(premium|standard|basic)-(\d+)x(\d+)x(\d+)/);
 if(!match)return {tier:null,w:null,d:null,h:null};
 return {tier:match[1],w:+match[2],d:+match[3],h:+match[4]};
};
const ledFolder=path.join(folder,'led');
const leds=fs.existsSync(ledFolder)?fs.readdirSync(ledFolder).sort():[];
const ledDecor={antracit:'antracit','black-matt':'black-matt','cool-white':'cool-white','dub-hunton-black-matt':'dub-hunton','dub-spanielsky':'dub-spanielsky'};
const report=[],vyradene=[],doplnene=[];
for(const p of PRODUCTS){
 const count=dvierkaPreSirku(p.w);
 // Plná paleta radu je na 100 cm produkte; väčším rozmerom sa dekory dopĺňajú
 // odtiaľ a hneď nižšie sa zase vyradia tie, ku ktorým fotka stále chýba.
 const vzor=PRODUCTS.find(q=>q.tier===p.tier&&q.w<120);
 if(vzor&&vzor!==p)for(const v of vzor.decors)if(!p.decors.some(d=>d.id===v.id)){
  p.decors.push({id:v.id,name:v.name,swatch:[...v.swatch],images:[]});doplnene.push(`${p.slug} / ${v.id}`);
 }
 const distance=f=>{
  const r=source(f),n=dvierkaFotky(f);
  const known=r.w!==null && (n===0||dvierkaPreSirku(r.w)===n);
  return (r.tier===p.tier?0:r.tier===null?1000:2000)+(known?Math.abs(r.w-p.w):400);
 };
 const order=(a,b)=>{
  // čelná zatvorená → šikmá zatvorená → otvorená → detail
  const rank=f=>dvierkaFotky(f)===0?3:jeOtvorena(f)&&p.tier!=='basic'?2:jeCelna(f)?0:1;
  return rank(a)-rank(b)||distance(a)-distance(b)||a.localeCompare(b);
 };
 for(const d of [...p.decors]){
  const before=JSON.stringify(d);
  const pool=[...(decorSets[d.id]??[])].flatMap(set=>sets[set]??[]);
  // Basic is an open steel frame; decorative closed cabinets cannot illustrate it.
  const candidates=(p.tier==='basic'?Object.keys(sets).filter(s=>s.startsWith('basic-')).flatMap(s=>sets[s]):pool)
   .filter(f=>dvierkaFotky(f)===count||dvierkaFotky(f)===0).sort(order);
  const full=candidates.filter(f=>dvierkaFotky(f)===count);
  for(const key of ['inherited','illuFrom','illuSize','illuDvierka','illuIdx'])delete d[key];
  // Dekor bez fotky v správnom počte dvierok sa pri Štandarde a Premium
  // z ponuky vyradí (rozhodnutie 11. 9. 2026) — vráti sa sám, keď klient
  // dodá vizualizáciu, lebo zoznam dekorov sa dopĺňa zo 100 cm produktu.
  if(p.tier!=='basic'&&full.length===0){p.decors.splice(p.decors.indexOf(d),1);vyradene.push(`${p.slug} / ${d.id}`);continue;}
  if(full.length===0 || (p.tier==='basic' && d.id!=='ram')){
   d.images=[schematic(p,d,write)];d.inherited=true;d.illuFrom='schema';
  }else{
   // Galéria = všetky zábery vlastného radu (aj sady bez radu) so správnym
   // počtom dvierok, nič sa neoseká. Iný rad sa primieša, len keď vlastný
   // rad nemá aspoň 4 zatvorené celé skrinky. Výška skrinky (80 vs 90) sa
   // pri „vlastnom rozmere" ignoruje — klient ich fotí ako jeden produkt.
   const vlastnyRad=candidates.filter(f=>{const r=source(f);return r.tier===null||r.tier===p.tier;});
   const zatvorene=vlastnyRad.filter(f=>dvierkaFotky(f)===count&&!jeOtvorena(f)).length;
   // Z iného radu nikdy otvorené zábery: vnútro (holý rám vs. opláštenie)
   // je presne to, čím sa rady líšia; zatvorená predná stena je spoločná.
   d.images=(zatvorene>=4?vlastnyRad:candidates.filter(f=>vlastnyRad.includes(f)||!jeOtvorena(f))).sort(order);
   const inherited=d.images.map((f,i)=>{
    if(dvierkaFotky(f)===0)return -1;
    const r=source(f);
    if(r.tier===null)return i;
    const unknownWidth=dvierkaPreSirku(r.w)!==count;
    return r.tier!==p.tier||unknownWidth||r.w!==p.w||r.d!==p.d?i:-1;
   }).filter(i=>i>=0);
   if(inherited.length){
    d.inherited=true;
    if(inherited.length<d.images.length)d.illuIdx=inherited;
    const original=source(d.images[inherited[0]]);
    d.illuFrom=original.tier&&original.tier!==p.tier?'rad':'rozmer';
    if(d.illuFrom==='rozmer'&&original.w!==null&&dvierkaPreSirku(original.w)===count)d.illuSize=`${original.w} × ${original.d} × ${original.h} cm`;
   }
  }
  delete d.led;
  const l=p.priceLed&&p.tier==='premium'?ledDecor[d.id]:null;
  if(l){
   for(const color of ['zlta','modra']){
    const images=leds.filter(f=>f.startsWith(`led-${l}-${color}-${count}d-`)).map(f=>`/img/products/led/${f}`);
    if(images.length)(d.led??={})[color]=images;
   }
  }
  if(before!==JSON.stringify(d))report.push(`${p.slug} / ${d.id}: ${d.illuFrom==='schema'?'schematic':d.illuFrom==='dvierka'?`${d.images.length} photos of ${d.illuDvierka}-door build`:`${d.images.length} compatible photos`}`);
 }
 // titulná fotka produktu: vlastný záber pred fotkou iného počtu dvierok pred schémou
 // titulná fotka karty: čelný záber má prednosť pred vlastným rozmerom, aby
 // boli všetky skrinky v katalógu otočené rovnako
 const score=d=>d.illuFrom==='schema'?100000:d.illuFrom==='dvierka'?50000:distance(d.images[0])+(jeOtvorena(d.images[0])&&p.tier!=='basic'?10000:0)+(jeCelna(d.images[0])?0:5000);
 p.decors.sort((a,b)=>score(a)-score(b));
 // Titulný dekor sa v rámci radu strieda medzi dekormi s čelnou vlastnou
 // fotkou — inak by mal každý rozmer Štandardu na karte tú istú čiernu skrinku.
 // stabilné poradie podľa id, nech rotácia dáva susedným rozmerom rôzne dekory
 const celne=p.decors.filter(d=>d.illuFrom!=='schema'&&jeCelna(d.images[0])).sort((a,b)=>a.id.localeCompare(b.id));
 if(celne.length>1){
  const poradie=PRODUCTS.filter(q=>q.tier===p.tier).indexOf(p);
  const prvy=celne[poradie%celne.length];
  p.decors.splice(p.decors.indexOf(prvy),1);p.decors.unshift(prvy);
 }
 p.cover=p.decors[0].images[0];
}
console.log(report.join('\n'));
const nove=doplnene.filter(x=>!vyradene.includes(x));
if(nove.length)console.log('Doplnené dekory (dorazila fotka):\n  '+nove.join('\n  '));
console.log('Vyradené dekory (bez fotky v správnom počte dvierok):\n  '+vyradene.join('\n  '));
console.log(`Updated ${report.length} galleries; removed ${vyradene.length}; schematics: ${PRODUCTS.flatMap(p=>p.decors).filter(d=>d.illuFrom==='schema').length}`);
if(write){
 const src=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
 const start=src.indexOf('export const PRODUCTS: Product[] = [');
 const end=src.indexOf('\n  ];',start);
 if(start<0||end<0)throw new Error('PRODUCTS array not found');
 fs.writeFileSync(file,src.slice(0,start)+'export const PRODUCTS: Product[] = '+JSON.stringify(PRODUCTS,null,2).slice(0,-1)+'  ];'+src.slice(end+5));
}
