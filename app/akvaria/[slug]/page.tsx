import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AkvariumObsah from "../AkvariumObsah";
import { AQUARIUMS } from "../../aquariums";
import { nacitajAkvarium } from "../../katalog/akvaria";
import { SK } from "../../preklady";

export function generateStaticParams() {
  return AQUARIUMS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await nacitajAkvarium(slug);
  if (!a) return { title: "Akvárium sa nenašlo" };
  return {
    title: `Akvárium ${a.dim} | AQUAPRIME`,
    description: SK.akvarium.popis.replace("{dim}", a.dim),
    alternates: {
      canonical: `/akvaria/${a.slug}`,
      languages: { sk: `/akvaria/${a.slug}`, en: `/en/akvaria/${a.slug}` },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await nacitajAkvarium(slug);
  if (!a) notFound();
  return <AkvariumObsah a={a} t={SK} jazyk="sk" />;
}
