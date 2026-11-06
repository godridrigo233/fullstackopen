import type { Metadata } from "next";
import Homepage from "./homepage.mdx";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <article className="markdown mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
      <Homepage />
    </article>
  );
}
