"use client";

import { useActionState, useState } from "react";
import { registerUser, type RegistrationState } from "@/app/register/actions";

const initialState: RegistrationState = {
  errors: {},
  values: { username: "", name: "" },
};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);
  const [values, setValues] = useState({
    ...initialState.values,
    password: "",
    passwordConfirm: "",
  });

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
        <label className="mb-1 block text-sm font-medium" htmlFor="username">
          Username
        </label>
        <input
          autoComplete="username"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          id="username"
          name="username"
          onChange={(event) => updateValue("username", event.target.value)}
          required
          value={values.username}
        />
        {state.errors.username && (
          <p className="mt-1 text-sm text-red-700" data-testid="username-error" role="alert">
            {state.errors.username}
          </p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          autoComplete="name"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          id="name"
          name="name"
          onChange={(event) => updateValue("name", event.target.value)}
          required
          value={values.name}
        />
        {state.errors.name && <p className="mt-1 text-sm text-red-700">{state.errors.name}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="new-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          id="password"
          name="password"
          onChange={(event) => updateValue("password", event.target.value)}
          required
          type="password"
          value={values.password}
        />
        {state.errors.password && <p className="mt-1 text-sm text-red-700">{state.errors.password}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="passwordConfirm">
          Confirm Password
        </label>
        <input
          autoComplete="new-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          id="passwordConfirm"
          name="passwordConfirm"
          onChange={(event) => updateValue("passwordConfirm", event.target.value)}
          required
          type="password"
          value={values.passwordConfirm}
        />
        {state.errors.passwordConfirm && (
          <p className="mt-1 text-sm text-red-700" data-testid="passwordConfirm-error" role="alert">
            {state.errors.passwordConfirm}
          </p>
        )}
      </div>
      <button
        className="w-full rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        data-testid="register-button"
        disabled={pending}
        type="submit"
      >
        {pending ? "Registering…" : "Register"}
      </button>
    </form>
  );
}
