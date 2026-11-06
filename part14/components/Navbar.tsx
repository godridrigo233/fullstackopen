import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link className="text-lg font-bold tracking-tight text-blue-700" href="/">
          Full Stack Open Blog
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          <Link className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100" href="/">
            home
          </Link>
          <Link className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100" href="/blogs">
            blogs
          </Link>
          <Link className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100" href="/users">
            users
          </Link>
          {session?.user ? (
            <>
              <Link className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100" href="/me">
                me
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100" href="/login">
                login
              </Link>
              <Link className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100" href="/register">
                register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
