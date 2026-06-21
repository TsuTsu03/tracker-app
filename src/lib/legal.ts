/**
 * Single source of truth for the legal pages (Privacy Policy + Terms of Service).
 *
 * ⚠️ EDIT THESE before going live. The documents are drafted against Philippine
 * law (Data Privacy Act of 2012 / RA 10173, E-Commerce Act / RA 8792, IP Code /
 * RA 8293) but the bracketed values below are placeholders only. Have the final
 * text reviewed by Philippine counsel and, where required, register your data
 * processing system / DPO with the National Privacy Commission (NPC).
 */
export const LEGAL = {
  appName: "WealthFlow",
  /** The registered entity that operates the app (sole prop / corporation / partnership). */
  entity: "[Registered Business / Entity Name]",
  /** Principal place of business — used for notices and ToS venue. */
  address: "[Business Address, City, Philippines]",
  /** City/Province whose courts have exclusive venue under the Terms. */
  venueCity: "[City], Philippines",
  /** General contact. */
  contactEmail: "[contact@yourdomain.ph]",
  /** Data Protection Officer — required under NPC rules once you process personal data at scale. */
  dpoName: "[Data Protection Officer name]",
  dpoEmail: "[dpo@yourdomain.ph]",
  /** Public site origin, used to build the canonical /privacy and /terms URLs. */
  siteUrl: "[https://yourdomain.ph]",
  /** Keep these in sync whenever you materially revise the documents. */
  effectiveDate: "June 22, 2026",
  lastUpdated: "June 22, 2026",
} as const;
