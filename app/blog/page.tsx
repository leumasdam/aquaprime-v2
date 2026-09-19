import type { Metadata } from "next";
import BlogZoznam from "./BlogZoznam";
import { vsetkyClanky } from "./clanky";
import { SK } from "../preklady";

export const metadata: Metadata = {
  title: SK.blog.metaTitul,
  description: SK.blog.metaPopis,
  alternates: { canonical: "/blog", languages: { sk: "/blog", en: "/en/blog" } },
  openGraph: {
    title: SK.blog.metaTitul,
    description: SK.blog.metaPopis,
    type: "website",
    locale: "sk_SK",
  },
};

export default function Page() {
  return <BlogZoznam clanky={vsetkyClanky()} jazyk="sk" />;
}
