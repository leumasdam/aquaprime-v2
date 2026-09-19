import type { Metadata } from "next";
import BlogZoznam from "../../blog/BlogZoznam";
import { vsetkyClanky } from "../../blog/clanky";
import { EN } from "../../preklady";

export const metadata: Metadata = {
  title: EN.blog.metaTitul,
  description: EN.blog.metaPopis,
  alternates: { canonical: "/en/blog", languages: { sk: "/blog", en: "/en/blog" } },
};

export default function Page() {
  return <BlogZoznam clanky={vsetkyClanky()} jazyk="en" />;
}
