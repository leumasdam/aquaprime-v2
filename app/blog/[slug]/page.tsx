import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Clanok from "../Clanok";
import { najdiClanok, suvisiaceClanky, vsetkyClanky } from "../clanky";

export function generateStaticParams() {
  return vsetkyClanky().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = najdiClanok(slug);
  if (!c) return { title: "Článok sa nenašiel | AQUAPRIME" };
  return {
    title: `${c.seoTitle} | AQUAPRIME`,
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: `/blog/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.description,
      type: "article",
      locale: "sk_SK",
      publishedTime: c.date,
      modifiedTime: c.date,
      authors: ["AQUAPRIME"],
      images: [{ url: c.cover, alt: c.coverAlt }],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.description, images: [c.cover] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = najdiClanok(slug);
  if (!c) notFound();
  return <Clanok c={c} suvisiace={suvisiaceClanky(c)} />;
}
