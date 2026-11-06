"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/NotificationProvider";

export function LoginForm() {
  const router = useRouter();
  const { notify } = useNotification();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    setPending(false);

    if (!result || result.error) {
      setError("Incorrect username or password.");
      return;
    }

    notify("Logged in successfully.");
    router.push("/");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" data-testid="error-message" role="alert">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="username">
          Username
        </label>
        <input
          autoComplete="username"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          id="username"
          name="username"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      <button
        className="w-full rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        data-testid="login-button"
        disabled={pending}
        type="submit"
      >
        {pending ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
