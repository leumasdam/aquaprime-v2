import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProduktObsah from "../../../skrinky/ProduktObsah";
import { PRODUCTS, getProduct } from "../../../products";
import { EN } from "../../../preklady";
import { radText } from "../../../jazyk";

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
  if (!p) return { title: "Cabinet not found" };
  return {
    title: `Cabinet ${radText(p.name, "en")} cm | AQUAPRIME`,
    description: EN.spolocne.radPopis[p.tier].replace("{rozmer}", p.dim),
    alternates: {
      canonical: `/en/skrinky/${p.slug}`,
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
  return <ProduktObsah p={p} t={EN} jazyk="en" />;
}
