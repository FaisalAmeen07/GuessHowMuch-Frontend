"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { signInWithEmail, type SignInState } from "@/features/auth/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const initialState: SignInState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "";
  const [state, formAction, pending] = useActionState(signInWithEmail, initialState);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <input type="hidden" name="returnTo" value={returnTo} />
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        placeholder="you@example.com"
        className={cn(
          "h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none",
          "placeholder:text-neutral-400 focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/20",
        )}
      />
      {state.error ? (
        <p className="mt-2 text-sm font-medium text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button
        type="submit"
        className="mt-4 w-full rounded-2xl"
        disabled={pending}
      >
        {pending ? "Signing in…" : "Continue with email"}
      </Button>
      <p className="mt-4 text-center text-xs leading-relaxed text-neutral-500">
        Demo: use{" "}
        <span className="font-semibold text-neutral-700">admin@guesshowmuch.app</span> for
        admin access. Any other email signs in as a user.
      </p>
    </form>
  );
}
