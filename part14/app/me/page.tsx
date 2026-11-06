import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/lib/db/queries";
import { generateApiToken, markAsRead } from "@/app/me/actions";

export default async function MePage() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!session?.user || !Number.isSafeInteger(userId) || userId < 1) {
    redirect("/login");
  }

  const user = await getUserProfile(userId);
  if (!user) {
    redirect("/login");
  }

  const unread = user.readingList.filter((item) => !item.read);
  const read = user.readingList.filter((item) => item.read);

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" data-testid="user-profile">
        <h1 className="text-3xl font-bold tracking-tight">My page</h1>
        <p className="mt-4 text-lg" data-testid="user-name">{user.name}</p>
        <p className="text-slate-600" data-testid="user-username">{user.username}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" data-testid="api-token-section">
        <h2 className="text-xl font-semibold">API token</h2>
        <p className="mt-2 text-sm text-slate-600">Use this token to access your profile through the API.</p>
        {user.token ? (
          <div className="mt-4" data-testid="token-display">
            <code className="block break-all rounded-md bg-slate-100 p-3" data-testid="api-token">
              {user.token}
            </code>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600" data-testid="no-token-message">
            No API token has been generated yet.
          </p>
        )}
        <form action={generateApiToken} className="mt-4">
          <button
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            data-testid="generate-token-button"
            type="submit"
          >
            Generate new token
          </button>
        </form>
      </section>

      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" data-testid="reading-list-section">
        <div>
          <h2 className="text-xl font-semibold">Reading list</h2>
          {user.readingList.length === 0 && (
            <p className="mt-3 text-slate-600" data-testid="empty-reading-list">
              Your reading list is empty.
            </p>
          )}
        </div>

        <section data-testid="unread-section">
          <h3 className="font-semibold">Unread</h3>
          {unread.length > 0 ? (
            <ul className="mt-2 space-y-3">
              {unread.map(({ blog }) => (
                <li className="flex flex-wrap items-center justify-between gap-3" key={blog.id}>
                  <Link className="text-blue-700 hover:underline" href={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                  <form action={markAsRead}>
                    <input name="blogId" type="hidden" value={blog.id} />
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
                      data-testid={`mark-read-${blog.id}`}
                      type="submit"
                    >
                      Mark as read
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600" data-testid="no-unread-blogs">
              No unread blogs.
            </p>
          )}
        </section>

        <section data-testid="read-section">
          <h3 className="font-semibold">Read</h3>
          {read.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {read.map(({ blog }) => (
                <li key={blog.id}>
                  <Link className="text-blue-700 hover:underline" href={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600" data-testid="no-read-blogs">
              No read blogs yet.
            </p>
          )}
        </section>
      </section>
    </div>
  );
}
