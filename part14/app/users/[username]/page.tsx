import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserWithBlogs } from "@/lib/db/queries";

type UserPageProps = {
  params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const user = await getUserWithBlogs(username);

  if (!user) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
        <p className="mt-2 text-slate-600">@{user.username}</p>
      </header>
      <div>
        <h2 className="mb-3 text-xl font-semibold">Blogs by {user.name}</h2>
        {user.blogs.length > 0 ? (
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {user.blogs.map((blog) => (
              <li className="p-4" key={blog.id}>
                <Link className="font-medium text-blue-700 hover:underline" href={`/blogs/${blog.id}`}>
                  {blog.title}
                </Link>
                <span className="ml-2 text-sm text-slate-500">{blog.likes} likes</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">This user has not added any blogs yet.</p>
        )}
      </div>
    </section>
  );
}
