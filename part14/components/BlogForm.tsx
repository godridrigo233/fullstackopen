"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBlog, type BlogFormState } from "@/app/blogs/actions";
import { useNotification } from "@/components/NotificationProvider";

const initialState: BlogFormState = {
  errors: {},
  values: { title: "", author: "", url: "" },
};

export function BlogForm() {
  const [state, formAction, pending] = useActionState(createBlog, initialState);
  const [values, setValues] = useState(initialState.values);
  const router = useRouter();
  const { notify } = useNotification();

  useEffect(() => {
    if (state.success) {
      notify("Blog created successfully.");
      router.push("/blogs");
    }
  }, [notify, router, state.success]);

  function updateValue(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.errors.form && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.errors.form}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          id="title"
          name="title"
          onChange={(event) => updateValue("title", event.target.value)}
          required
          value={values.title}
        />
        {state.errors.title && <p className="mt-1 text-sm text-red-700">{state.errors.title}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="author">
          Author
        </label>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          id="author"
          name="author"
          onChange={(event) => updateValue("author", event.target.value)}
          required
          value={values.author}
        />
        {state.errors.author && <p className="mt-1 text-sm text-red-700">{state.errors.author}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="url">
          URL
        </label>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          id="url"
          name="url"
          onChange={(event) => updateValue("url", event.target.value)}
          required
          type="url"
          value={values.url}
        />
        {state.errors.url && <p className="mt-1 text-sm text-red-700">{state.errors.url}</p>}
      </div>
      <button
        className="w-full rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        data-testid="create-blog-button"
        disabled={pending}
        type="submit"
      >
        {pending ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
