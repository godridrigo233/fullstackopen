import Link from "next/link";
import type { Metadata } from "next";
import { getBlogs } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Blogs",
};

type BlogsPageProps = {
  searchParams: Promise<{ filter?: string | string[] }>;
};

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const query = await searchParams;
  const filter = typeof query.filter === "string" ? query.filter.trim() : "";
  const blogList = await getBlogs(filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="mt-2 text-slate-600">Browse and search the latest blog posts.</p>
        </div>
        <Link className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800" href="/blogs/new">
          Create a blog
        </Link>
      </div>

      <form action="/blogs" className="flex max-w-xl gap-2" method="get">
        <label className="sr-only" htmlFor="filter">
          Search blogs by title
        </label>
        <input
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2"
          data-testid="filter-input"
          defaultValue={filter}
          id="filter"
          name="filter"
          placeholder="Search by title"
          type="search"
        />
        <button
          className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-100"
          data-testid="search-button"
          type="submit"
        >
          Search
        </button>
      </form>

      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white" data-testid="blogs-list">
        {blogList.length > 0 ? (
          blogList.map((blog) => (
            <article className="flex flex-wrap items-center justify-between gap-3 p-5" key={blog.id}>
              <div>
                <h2 className="text-lg font-semibold">
                  <Link className="text-blue-700 hover:underline" href={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-slate-600">by {blog.author}</p>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                {blog.likes} likes
              </p>
            </article>
          ))
        ) : (
          <p className="p-5 text-slate-600">
            {filter ? "No blogs match your search." : "No blogs have been published yet."}
          </p>
        )}
      </div>
    </div>
  );
}
