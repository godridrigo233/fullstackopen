import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in with your username and password.</p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </section>
  );
}
