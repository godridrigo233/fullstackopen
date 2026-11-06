import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBlog, isOnReadingList } from "@/lib/db/queries";
import { addToReadingList, likeBlog } from "@/app/blogs/actions";

type BlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isSafeInteger(id) || id < 1) {
    notFound();
  }

  const blog = await getBlog(id);
  if (!blog) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  const isLoggedIn = Boolean(session?.user && Number.isSafeInteger(userId) && userId > 0);
  const isOwnBlog = isLoggedIn && blog.userId === userId;
  const isSaved =
    isLoggedIn && !isOwnBlog ? await isOnReadingList(userId, blog.id) : false;

  return (
    <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" data-testid="blog-detail">
      <Link className="text-sm font-medium text-blue-700 hover:underline" href="/blogs">
        ← All blogs
      </Link>
      <h1 className="mt-5 text-3xl font-bold" data-testid="blog-title">
        {blog.title}
      </h1>
      <p className="mt-2 text-slate-600" data-testid="blog-author">
        by {blog.author}
      </p>
      <a
        className="mt-3 inline-block break-all text-blue-700 underline"
        href={blog.url}
        rel="noreferrer"
        target="_blank"
      >
        {blog.url}
      </a>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="font-medium" data-testid="blog-likes">
          {blog.likes} likes
        </span>
        <form action={likeBlog}>
          <input name="id" type="hidden" value={blog.id} />
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100" type="submit">
            Like
          </button>
        </form>
      </div>

      {isLoggedIn && !isOwnBlog && (
        <div className="mt-6">
          {isSaved ? (
            <p className="text-sm font-medium text-emerald-700">This blog is on your reading list.</p>
          ) : (
            <form action={addToReadingList}>
              <input name="blogId" type="hidden" value={blog.id} />
              <button
                className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                data-testid="add-to-reading-list-button"
                type="submit"
              >
                Add to reading list
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}
