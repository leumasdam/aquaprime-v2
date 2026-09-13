const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const source = process.argv[2] || path.join(require('node:os').homedir(), 'Downloads');
const files = {
 'dubovy-interier': '7ff7c229-baee-43c8-afa5-75cbf4c30818',
 'antracit': '03eaf204-fbc8-4d82-a676-79611a62a36c',
 'biela-kocka': 'b067857e-bbbb-47b3-80c2-bde3a0067e01',
 'dub-detail': 'fe72c8b6-4cb0-4d2a-9edf-7e8d7f7cf402',
 'biela-hotova': 'fefef5cb-5188-490c-8639-8ae9fa489762',
 'biela-montaz': 'd84d182a-aae0-4b30-a73d-d4289569eef1',
 'biela-pred': '2cb84931-3885-4a90-86c0-954f93cf4dff',
 'konstrukcia': '29b2c235-719d-4b24-a596-8326e07e86d7'
};
(async () => {
 await fs.mkdir('public/realizacie/galeria', {recursive: true});
 for (const [name,id] of Object.entries(files)) {
   const result = await sharp(path.join(source, `${id}.jpg`)).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:85}).toFile(`public/realizacie/galeria/${name}.webp`);
   console.log(name, result.width, result.height, result.size);
 }
})();

