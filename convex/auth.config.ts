import type { AuthConfig } from "convex/server";

const siteUrl = process.env.SITE_URL!;

export default {
  providers: [
    {
      type: "customJwt",
      issuer: siteUrl,
      applicationID: "convex",
      jwks: `${siteUrl}/api/auth/jwks`,
      algorithm: "RS256",
    },
  ],
} satisfies AuthConfig;