import { isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export async function requireAuth(callbackUrl?: string) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    const loginUrl = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";
    redirect(loginUrl);
  }
}
