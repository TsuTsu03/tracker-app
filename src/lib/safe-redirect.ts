/**
 * Open-redirect guard. Post-login / post-OAuth flows take a caller-supplied
 * `next` destination; if that value can be an absolute or protocol-relative URL,
 * an attacker crafts a link that bounces the freshly-authenticated user to a
 * phishing site. This collapses any untrusted value to a safe same-origin path.
 *
 * A value is accepted ONLY when it is a single-slash relative path. Rejected:
 *   - absolute URLs ........... https://evil.com
 *   - protocol-relative ....... //evil.com
 *   - backslash variant ....... /\evil.com   (browsers treat as //evil.com)
 *   - userinfo trick .......... @evil.com    (origin + value -> origin@evil.com)
 *   - empty / non-string ...... -> fallback
 */
export function safeNextPath(raw: unknown, fallback = "/dashboard"): string {
  const value = typeof raw === "string" ? raw : "";
  return /^\/(?![/\\])/.test(value) ? value : fallback;
}
