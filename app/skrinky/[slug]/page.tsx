import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProduktObsah from "../ProduktObsah";
import { PRODUCTS, getProduct } from "../../products";
import { SK } from "../../preklady";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
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
  const p = getProduct(slug);
  if (!p) notFound();
  return <ProduktObsah p={p} t={SK} jazyk="sk" />;
}
