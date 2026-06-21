import type { Metadata } from "next";
import { Inter, Geist_Mono, Fraunces } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import {
  COMPANY_MAP,
  DEFAULT_COMPANY,
  THEME_COOKIE,
} from "@/lib/insurance-companies";

// Body typeface — Inter, per the Stitch design system. Kept on the
// `--font-geist-sans` variable name so every existing `font-sans` / body
// reference adopts it with no further edits.
const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial display serif — paired with Geist on a true contrast axis
// (serif + geometric sans). Used for page titles and headline moments only.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "WealthFlow — AI Sales OS for Financial Advisors",
  description:
    "From lead generation to policy servicing, everything a Financial Advisor needs in one platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Render the advisor's chosen company palette on the server (from a cookie)
  // so there's no flash of the default theme on load.
  const raw = (await cookies()).get(THEME_COOKIE)?.value;
  const theme =
    raw && (raw === DEFAULT_COMPANY || COMPANY_MAP[raw]) ? raw : DEFAULT_COMPANY;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      data-theme={theme}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
