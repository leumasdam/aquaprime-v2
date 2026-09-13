/** Exportuje zdieľanú skicu konfigurátora; nejde o fotografiu produktu. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dvierkaPreSirku, cabinetSurfaces } from '../app/cabinet-construction.ts';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Build-only TSX loader: the exported drawing is the same component used by the app.
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
      fileName: filename,
    }).outputText;
    module._compile(output, filename);
  };
}
const Preview = require('../app/CabinetPreview.tsx').default;

export function schematic(p, d, write = true) {
  const url = `/img/products/schematics/${p.slug}-${d.id}-${dvierkaPreSirku(p.w)}d.svg`;
  if (!write) return url;
  const decor = { id: d.id, name: d.name, swatch: d.swatch, ...cabinetSurfaces(d) };
  let svg = renderToStaticMarkup(React.createElement(Preview, {
    w: p.w, d: p.d, h: p.h, tier: p.tier, decor, feet: 'wheels', led: false, tank: null,
  }));
  svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" ')
    .replace(/href="(\/[^\"]+)"/g, (_, source) => `href="data:image/webp;base64,${fs.readFileSync(path.join(root, 'public', source)).toString('base64')}"`)
    .replace(/(<svg[^>]*>)/, '$1<rect width="480" height="360" fill="#fafafa"/><style>.cabsvg__dim line{stroke:#737a80;stroke-width:.7}.cabsvg__dim text{fill:#4b555c;font:10px Arial,sans-serif}</style>');
  fs.mkdirSync(path.join(root,'public/img/products/schematics'),{recursive:true});
  fs.writeFileSync(path.join(root,'public',url),svg);
  return url;
}
