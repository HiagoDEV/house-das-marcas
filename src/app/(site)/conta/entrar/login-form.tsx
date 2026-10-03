"use client";

import { useActionState } from "react";
import { loginCustomerAction, type AuthFormState } from "@/actions/customer-auth";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginCustomerAction, initialState);

  return (
    <form action={formAction} className="space-y-4 bg-surface border border-surface-border rounded-xl p-6">
      <div>
        <label htmlFor="email" className="block text-sm text-muted mb-1">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm text-muted mb-1">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg bg-black/30 border border-surface-border px-3 py-2 outline-none focus:border-gold"
        />
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-gold text-black font-medium py-2 hover:brightness-110 disabled:opacity-60 transition"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
