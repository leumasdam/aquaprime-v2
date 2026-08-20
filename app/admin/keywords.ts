// Plán kľúčových fráz pre aquaprime.sk — ručne zostavený štartovací zoznam
// podľa katalógu a cenotvorby. Reálne objemy vyhľadávania sa nedajú čestne
// odhadnúť bez dát: po zapojení Search Console sa vedľa plánu ukazujú
// skutočné dopyty (zobrazenia = koľkokrát sa web reálne ukázal v Googli).

export type Zamer = "produkt" | "informačný" | "brand";

export type PlanFraza = {
  fraza: string;
  zamer: Zamer;
  /** 1 = najvyššia priorita */
  priorita: 1 | 2 | 3;
  /** kam má fráza viesť */
  ciel: string;
  pozn: string;
};

export const PLAN_FRAZ: PlanFraza[] = [
  { fraza: "skrinka pod akvárium", zamer: "produkt", priorita: 1, ciel: "/skrinky", pozn: "hlavná fráza celého webu" },
  { fraza: "stolík pod akvárium", zamer: "produkt", priorita: 1, ciel: "/skrinky", pozn: "synonymum, ľudia hľadajú aj takto" },
  { fraza: "podstavec pod akvárium", zamer: "produkt", priorita: 1, ciel: "/skrinky", pozn: "tretí variant tej istej potreby" },
  { fraza: "akvárium na mieru", zamer: "produkt", priorita: 1, ciel: "/akvaria", pozn: "výroba na mieru = hlavná výhoda" },
  { fraza: "výroba akvárií", zamer: "produkt", priorita: 2, ciel: "/akvaria", pozn: "B2B aj nároční hobbisti" },
  { fraza: "akvárium 200 l", zamer: "produkt", priorita: 2, ciel: "/akvaria", pozn: "rozmerové dopyty — každý rozmer má vlastnú URL" },
  { fraza: "skrinka pod akvárium 200 litrov", zamer: "produkt", priorita: 2, ciel: "/skrinky", pozn: "long-tail s vysokou nákupnou intenciou" },
  { fraza: "akvarijný nábytok", zamer: "produkt", priorita: 2, ciel: "/skrinky", pozn: "širší pojem, menšia konkurencia v SK" },
  { fraza: "morské akvárium na mieru", zamer: "produkt", priorita: 2, ciel: "/akvaria", pozn: "vyššie rozpočty, menej dopytov" },
  { fraza: "akvárium s LED podsvietením", zamer: "produkt", priorita: 3, ciel: "/skrinky", pozn: "LED kolekcia" },
  { fraza: "nosnosť skrinky pod akvárium", zamer: "informačný", priorita: 2, ciel: "blog / technológia", pozn: "obsahová téma — oceľový rám 770 kg je unikátny argument" },
  { fraza: "aké sklo na akvárium hrúbka", zamer: "informačný", priorita: 3, ciel: "blog", pozn: "tabuľka hrúbok skla z cenníka = hotový obsah" },
  { fraza: "koľko váži akvárium s vodou", zamer: "informačný", priorita: 3, ciel: "blog / konfigurátor", pozn: "kalkulačka zaťaženia už na webe existuje" },
  { fraza: "aquaprime", zamer: "brand", priorita: 3, ciel: "/", pozn: "brand — porastie sám s marketingom" },
];
