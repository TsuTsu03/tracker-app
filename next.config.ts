import type { NextConfig } from "next";

/**
 * Security response headers applied to every route. These are framework-agnostic
 * hardening defaults appropriate for an app that handles client financial PII.
 * (A full Content-Security-Policy is intentionally omitted here — it needs a
 * per-request nonce to coexist with Next's inline runtime; add it separately.)
 */
const securityHeaders = [
  // Force HTTPS for 2 years, including subdomains.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Clickjacking protection — the app is never meant to be framed.
  { key: "X-Frame-Options", value: "DENY" },
  // Block MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs (which can carry the `next` path) to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Drop access to powerful APIs the app doesn't use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
