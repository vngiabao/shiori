import type { SupabaseClient } from "@supabase/supabase-js";
export type Account = {
  id: string;
  email: string;
  name: string;
  provider: "google" | "apple" | "email";
};

/**
 * Sign-in through Supabase Auth (Google, Apple, email one-time code).
 * Configure with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY; until then the
 * app runs as a local, account-free study room. The SDK is loaded only when
 * sign-in is actually used, so it costs nothing for local learners.
 *
 * Accounts identify the learner. Optional consent-based sync is in sync.ts;
 * local IndexedDB remains available offline and after signing out.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const authConfigured = Boolean(url && key);

let client: Promise<SupabaseClient> | null = null;
export function supabase() {
  if (!authConfigured) throw new Error("Sign-in isn’t connected yet.");
  client ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(url!, key!, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    }),
  );
  return client;
}

export type OAuthProvider = "google" | "apple";

export async function signInWith(provider: OAuthProvider) {
  const { error } = await (
    await supabase()
  ).auth.signInWithOAuth({
    provider,
    options: { redirectTo: location.origin + location.pathname },
  });
  if (error) throw new Error(friendly(error.message));
}

/** Sends a 6-digit code (and a link) to the address. */
export async function sendEmailCode(email: string) {
  const { error } = await (
    await supabase()
  ).auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: location.origin + location.pathname,
    },
  });
  if (error) throw new Error(friendly(error.message));
}

export async function verifyEmailCode(
  email: string,
  token: string,
): Promise<Account> {
  const { data, error } = await (
    await supabase()
  ).auth.verifyOtp({
    email,
    token: token.trim(),
    type: "email",
  });
  if (error || !data.user)
    throw new Error(friendly(error?.message ?? "That code didn’t work."));
  return toAccount(data.user);
}

/** After an OAuth redirect, or on any load: the signed-in account, if any. */
export async function currentAccount(): Promise<Account | null> {
  if (!authConfigured) return null;
  const { data } = await (await supabase()).auth.getSession();
  return data.session ? toAccount(data.session.user) : null;
}

export async function signOut() {
  if (authConfigured) {
    const { error } = await (await supabase()).auth.signOut({ scope: "local" });
    if (error) throw new Error(friendly(error.message));
  }
}

function toAccount(user: {
  id: string;
  email?: string;
  app_metadata?: { provider?: string };
  user_metadata?: Record<string, unknown>;
}): Account {
  const provider = user.app_metadata?.provider;
  const meta = user.user_metadata ?? {};
  const name = (meta.full_name ?? meta.name ?? "") as string;
  return {
    id: user.id,
    provider:
      provider === "google" || provider === "apple" ? provider : "email",
    email: user.email ?? "",
    name: name.split(" ")[0] ?? "",
  };
}

function friendly(message: string) {
  if (/rate|too many/i.test(message))
    return "Too many tries. Wait a minute, then try again.";
  if (/expired|invalid/i.test(message))
    return "That code is wrong or has expired. Ask for a new one.";
  if (/fetch|network/i.test(message))
    return "You seem to be offline. Connect, or continue without an account.";
  return message;
}
