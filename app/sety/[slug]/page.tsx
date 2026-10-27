import { textySetu } from "../../sety";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SetDetail from "../SetDetail";
import { SETY, titulnaFotka } from "../../sety";
import { nacitajSet } from "../../katalog/sety";
import { SK } from "../../preklady";

export function generateStaticParams() {
  return SETY.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = await nacitajSet(slug);
  if (!s) return { title: "Set sa nenašiel" };
  return {
    title: `${s.nazov} — ${textySetu(s, "sk").podtitul} | AQUAPRIME`,
    description: textySetu(s, "sk").popis[0],
    alternates: {
      canonical: `/sety/${s.id}`,
      languages: { sk: `/sety/${s.id}`, en: `/en/sety/${s.id}` },
    },
    openGraph: {
      title: `${s.nazov} — ${textySetu(s, "sk").podtitul} | AQUAPRIME`,
      description: textySetu(s, "sk").popis[0],
      type: "website",
      locale: "sk_SK",
      images: [{ url: titulnaFotka(s), width: 1122, height: 1402 }],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = await nacitajSet(slug);
  if (!s) notFound();
  return <SetDetail set={s} t={SK} jazyk="sk" />;
}
