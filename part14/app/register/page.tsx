import type { Metadata } from "next";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <p className="mt-2 text-sm text-slate-600">Register to publish blogs and build your reading list.</p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </section>
  );
}
