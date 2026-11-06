import type { Metadata } from "next";
import { BlogForm } from "@/components/BlogForm";

export const metadata: Metadata = {
  title: "Create a blog",
};

export default function NewBlogPage() {
  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Create a new blog</h1>
      <p className="mt-2 text-sm text-slate-600">All fields must contain at least five characters.</p>
      <div className="mt-6">
        <BlogForm />
      </div>
    </section>
  );
}
