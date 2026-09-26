import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SetDetail from "../SetDetail";
import { SETY, najdiSet } from "../../sety";
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
  const s = najdiSet(slug);
  if (!s) return { title: "Set sa nenašiel" };
  return {
    title: `${s.nazov} — ${s.podtitul.sk} | AQUAPRIME`,
    description: s.popis.sk[0],
    alternates: {
      canonical: `/sety/${s.id}`,
      languages: { sk: `/sety/${s.id}`, en: `/en/sety/${s.id}` },
    },
    openGraph: {
      title: `${s.nazov} — ${s.podtitul.sk} | AQUAPRIME`,
      description: s.popis.sk[0],
      type: "website",
      locale: "sk_SK",
      images: [{ url: s.obrazok, width: 1122, height: 1402 }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = najdiSet(slug);
  if (!s) notFound();
  return <SetDetail set={s} t={SK} jazyk="sk" />;
}
