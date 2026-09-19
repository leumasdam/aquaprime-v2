# Layout editor — vizuálne ladenie breakpointov

Figma-lite nad hotovým webom. Vedľa seba ukáže tú istú stránku vo viacerých
šírkach (artboardy), prvky sa dajú chytiť myšou a posunúť, zmeniť im veľkosť,
prepísať text. Výsledok sa uloží ako `css/overrides.css` + `css/overrides.json`,
takže samotný web zostáva nedotknutý.

## Čo je v balíku

    tools/editor.html      celý editor, jeden súbor, žiadne knižnice zvonku
    tools/serve.ps1        lokálny server (PowerShell, netreba Node ani Python)
    tools/overrides.js     jeden riadok do webu, ktorý úpravy načíta
    tools/cutout.html      bokom: odstránenie pozadia z fotky (WASM, offline)

## Nasadenie na nový web — 3 kroky

1. Skopíruj priečinok `tools/` do koreňa webu (tam, kde je `index.html`).

2. Do `<head>` stránky pridaj jeden riadok:

       <script src="tools/overrides.js"></script>

3. Spusti server z koreňa webu:

       powershell -ExecutionPolicy Bypass -File tools\serve.ps1

   a otvor **http://localhost:8139/tools/editor.html**

Ak už web beží na inom serveri (Vite, Live Server, `python -m http.server`),
`serve.ps1` netreba na prezeranie — ale **je potrebný na ukladanie**, lebo
editor posiela súbory cez `POST /upload`. Vtedy ho pusti na tom istom koreni.

Každému projektu daj iný port (`-Port 8140`). Editor si nastavenia drží
v `localStorage`, ktorý je viazaný na port, takže sa projekty neprepíšu.

## Ako sa to ovláda

- **klik** = výber prvku, **Ctrl/Shift+klik** = viac prvkov naraz, ťahanie = posun
- **rohové úchytky** — text mení `font-size`, box `width`+`height`, skupina proporčne
- **dvojklik** na text = editácia priamo v mape stránky
- **dvojklik na obrázok alebo video** = úprava výrezu v ráme. Médium sedí v ráme
  cez `object-fit: cover`, takže sa vždy niečo oreže — tu určíš čo. Ťahaním
  myšou posúvaš, kolieskom zoomuješ, šípkami posúvaš po pixeli (so Shiftom po
  desiatich), Esc končí. To isté sa dá číselne v paneli **výrez**, kde je aj
  prepínač cover / contain / fill a ↺ na vrátenie pôvodného stavu.
  Rám samotný sa mení bežne — vyber ho vo Vrstvách a potiahni úchytky.
- **voľná vrstva — neorezávať** (v paneli výrez) = médium sa prestane orezávať
  a správa sa ako samostatná vrstva: zväčšuješ ho úchytkami, posúvaš ťahaním
  a nič mu neuberie okraje. Orezávajú totiž tri veci naraz — `object-fit: cover`
  zvnútra, prípadná `mask-image` a `overflow: hidden` na rodičovi — a táto
  voľba vypne všetky tri (rodičovi nastaví `overflow: visible`). Bez nej sa
  zväčšenie len oreže a vyzerá to, že sa nič nedeje.
- **☰ Vrstvy** — strom sekcií, zamykanie vrstiev (zamknutá prepúšťa kliky,
  podržanie kurzora ~0,7 s ponúkne odomknutie). V režime **čisté** sa
  preskakujú obalové divy, ktoré nič nekreslia, a dekorácie (`aria-hidden`)
  sú jeden riadok namiesto rozobratých písmen — okrem obalov s médiom, tie
  ostávajú rozbaliteľné, aby sa dalo kliknúť na obrázok či video.
- **▦ Grid** — stĺpce, moduly, baseline, guides (Bootstrap, Material, švajčiarsky,
  zlatý rez…), 🧲 prichytávanie, Ctrl počas ťahania ho dočasne vypne
- **🖼 Refs** — podloženie pôvodnej predlohy (screenshot z Figmy) pod artboard
- **✋ / H** — posúvanie plochy, Ctrl+Z / Ctrl+Shift+Z undo a redo
- **Uložiť** zapíše `css/overrides.css` a `css/overrides.json`

Panel dizajn tokenov číta premenné z `:root` stránky — ak web používa
`--farba-…`, `--fs-…`, dajú sa ladiť naživo a uložia sa do overrides.

## Na čo si dať pozor

- Všetko v `overrides.css` je s `!important`. Je to zámer (prebiť pôvodné CSS),
  ale keď sa úprava ustáli, oplatí sa ju prepísať do hlavného `style.css`
  a z overrides vyhodiť — inak sa to časom zamotá.
- Selektory sa generujú z id/tried/pozície (`:nth-child`). Keď v HTML
  preusporiadaš prvky, staré overrides môžu sadnúť na iný prvok.
- Panel **Sekcia** sa plní zo `<section id="…">`. Bez id sekcií funguje
  všetko ostatné, len skok na sekciu a zoznam vrstiev budú chudobnejšie.
- Editor potrebuje rovnaký pôvod (iframe), takže cez `file://` nepobeží.

## Text na vloženie do chatu s Claude na druhom počítači

> Mám nástroj `tools/editor.html` — vizuálny editor breakpointov (artboardy
> stránky vedľa seba, drag, resize, inline text, grid, vrstvy), ukladá do
> `css/overrides.css` + `css/overrides.json`. Návod je v `NAVOD.md` vedľa neho.
> Napoj ho na tento web: skopíruj `tools/` do koreňa, pridaj
> `<script src="tools/overrides.js"></script>` do `<head>`, spusti
> `tools\serve.ps1` a over v prehliadači, že artboardy nabehnú a Uložiť zapíše
> súbory. Sekcie webu maj `<section id="…">`, nech funguje panel Vrstvy.
