import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProduktObsah from "../ProduktObsah";
import { nacitajSkrinky, nacitajSkrinku } from "../../katalog/skrinky";
import { SK } from "../../preklady";

/* Predgenerujú sa skrinky zverejnené v čase buildu. Skrinka pridaná neskôr
   v administrácii sa vyrenderuje pri prvej návšteve (dynamicParams je
   predvolene zapnuté) a odvtedy ide z cache ako ostatné. */
export async function generateStaticParams() {
  return (await nacitajSkrinky()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await nacitajSkrinku(slug);
  if (!p) return { title: "Skrinka sa nenašla" };
  return {
    title: `Skrinka ${p.name} cm | AQUAPRIME`,
    description: p.desc,
    alternates: {
      canonical: `/skrinky/${p.slug}`,
      languages: { sk: `/skrinky/${p.slug}`, en: `/en/skrinky/${p.slug}` },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await nacitajSkrinku(slug);
  if (!p) notFound();
  return <ProduktObsah p={p} t={SK} jazyk="sk" />;
}
