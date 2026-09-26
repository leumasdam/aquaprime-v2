import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SetDetail from "../../../sety/SetDetail";
import { SETY, najdiSet } from "../../../sety";
import { EN } from "../../../preklady";

export function generateStaticParams() {
  return SETY.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = najdiSet(slug);
  if (!s) return { title: "Set not found" };
  return {
    title: `${s.nazov} — ${s.podtitul.en} | AQUAPRIME`,
    description: s.popis.en[0],
    alternates: {
      canonical: `/en/sety/${s.id}`,
      languages: { sk: `/sety/${s.id}`, en: `/en/sety/${s.id}` },
    },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const q = await searchParams;
  const prevedenie = typeof q.prevedenie === "string" ? q.prevedenie : undefined;
  const s = najdiSet(slug);
  if (!s) notFound();
  return <SetDetail set={s} t={EN} jazyk="en" prevedenie={prevedenie} />;
}
