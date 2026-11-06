import Link from "next/link";
import type { Metadata } from "next";
import { getUsers } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Users",
};

export default async function UsersPage() {
  const userList = await getUsers();

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-2 text-slate-600">Explore the authors in the community.</p>
      </div>
      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {userList.length > 0 ? (
          userList.map((user) => (
            <li className="p-4" key={user.id}>
              <Link className="font-medium text-blue-700 hover:underline" href={`/users/${encodeURIComponent(user.username)}`}>
                {user.name}
              </Link>
              <span className="ml-2 text-sm text-slate-500">@{user.username}</span>
            </li>
          ))
        ) : (
          <li className="p-4 text-slate-600">No users have registered yet.</li>
        )}
      </ul>
    </section>
  );
}
