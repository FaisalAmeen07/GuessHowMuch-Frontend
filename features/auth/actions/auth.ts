"use server";

import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { canAccessAdminRoute, homeRouteForSession } from "@/lib/auth/redirects";
import { defaultNicknameForEmail } from "@/lib/auth/nickname";
import { resolveRoleFromEmail } from "@/lib/auth/resolveRoleFromEmail";
import { clearSession, getSession, setSession } from "@/lib/auth/session";
import type { AuthSession } from "@/lib/auth/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignInState = {
  error?: string;
};

export async function signInWithEmail(
  _prev: SignInState | undefined,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const returnTo = String(formData.get("returnTo") ?? "").trim();

  if (!email || !EMAIL_RE.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const role = resolveRoleFromEmail(email);
  const session: AuthSession = {
    email,
    role,
    nickname: defaultNicknameForEmail(email, role),
  };
  await setSession(session);

  const safeReturn =
    returnTo &&
    returnTo.startsWith("/") &&
    !returnTo.startsWith("//") &&
    (returnTo !== routes.submissions || canAccessAdminRoute(session)) &&
    (returnTo !== routes.profile || Boolean(session));

  if (safeReturn) {
    redirect(returnTo);
  }

  redirect(homeRouteForSession(session));
}

export type UpdateNicknameState = {
  error?: string;
  success?: boolean;
};

export async function updateNickname(
  _prev: UpdateNicknameState | undefined,
  formData: FormData,
): Promise<UpdateNicknameState> {
  const session = await getSession();
  if (!session) {
    return { error: "Sign in to update your profile." };
  }

  const nickname = String(formData.get("nickname") ?? "").trim();
  if (!nickname) {
    return { error: "Nickname cannot be empty." };
  }
  if (nickname.length > 32) {
    return { error: "Nickname must be 32 characters or less." };
  }

  await setSession({ ...session, nickname });
  return { success: true };
}

export async function signOut(): Promise<void> {
  await clearSession();
  redirect(routes.login);
}
