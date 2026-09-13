export const categories = ["Všetky zábery", "Zariadené akváriá", "Pred zariadením", "Konštrukcie"] as const;
export type Category = typeof categories[number];
/* review = vecný popis záberu (nie zákaznícka recenzia — ilustračné výpovede boli
   nahradené popismi podľa auditu textov 11. 9. 2026); author ostáva prázdny */
export type Project = { id: string; title: string; category: Category; detail: string; image: string; alt: string; review: string; author: string };
// Fiktívne ukážkové recenzie aj mená. Označenie ukážky musí zostať pri každej recenzii; nepridávať Review schema.
export const projects: Project[] = [
  { id: "dubovy-interier", title: "Akvárium so skrinkou v dubovom dekore", category: "Zariadené akváriá", detail: "Dubový dekor / rastlinné akvárium", image: "dubovy-interier", alt: "Rastlinné akvárium na skrinke v dubovom dekore v svetlom interiéri", review: "Zostava s drevodekorom a rastlinným akváriom.", author: "" },
  { id: "antracit", title: "Antracitová skrinka s otvorenou nádržou", category: "Zariadené akváriá", detail: "Antracit / otvorená nádrž", image: "antracit", alt: "Otvorené akvárium so skalármi, koreňmi a kameňmi na antracitovej skrinke", review: "Tmavé vyhotovenie skrinky pod otvoreným akváriom.", author: "" },
  { id: "biela-kocka", title: "Biela zostava v menšom priestore", category: "Zariadené akváriá", detail: "Biela zostava / kompaktný formát", image: "biela-kocka", alt: "Kompaktné akvárium s kamennou kompozíciou na vysokej bielej skrinke", review: "Kompaktná zostava s bielou skrinkou.", author: "" },
  { id: "dub-detail", title: "Detail skrinky v dubovom dekore", category: "Zariadené akváriá", detail: "Dubový dekor / detail zostavy", image: "dub-detail", alt: "Detail husto osadeného rastlinného akvária na dvojdverovej skrinke s dubovým dekorom", review: "Pohľad na povrch a čelnú časť skrinky.", author: "" },
  { id: "biela-hotova", title: "Biela zostava po zariadení akvária", category: "Zariadené akváriá", detail: "Biela zostava / po zariadení", image: "biela-hotova", alt: "Zariadené akvárium s koreňmi a svetlým pieskom na bielej skrinke pri žltej stene", review: "Akvárium po doplnení substrátu a dekorácií.", author: "" },
  { id: "biela-montaz", title: "Biela zostava so závesným osvetlením", category: "Pred zariadením", detail: "Biela skrinka / závesné osvetlenie", image: "biela-montaz", alt: "Prázdna otvorená nádrž na bielej trojdverovej skrinke so závesným svetlom", review: "Nádrž so skrinkou pred napustením a zariadením.", author: "" },
  { id: "biela-pred", title: "Biela zostava pred zariadením", category: "Pred zariadením", detail: "Biela zostava / pred zariadením", image: "biela-pred", alt: "Prázdne akvárium s bielym krytom a skrinkou vedľa televízora", review: "Pohľad na osadenú skrinku a prázdnu nádrž.", author: "" },
  { id: "konstrukcia", title: "Oceľový rám s dubovým dekorom", category: "Konštrukcie", detail: "Oceľová konštrukcia / dubový dekor", image: "konstrukcia", alt: "Vysoká čierna kovová konštrukcia s policami a spodnou skrinkou v dubovom dekore", review: "Otvorené vyhotovenie s policami a uzavretou spodnou časťou.", author: "" },
];
export const photo = (project: Project) => `/realizacie/galeria/${project.image}.webp`;

