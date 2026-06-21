"use client";

import { useState } from "react";
import { Play, ImageOff } from "lucide-react";
import type { ProductCategory } from "@/lib/insurance-companies";

// Deterministic lifestyle photo per product (Lorem Picsum — free, no API key).
// Falls back to a themed gradient if the image can't load (e.g. offline).
function photoUrl(seed: string, w = 1200, h = 675) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

/** YouTube search for the product — opens real, relevant explainer videos. */
export function youtubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

const CATEGORY_BLURB: Record<ProductCategory, string> = {
  VUL: "Investment + protection",
  Life: "Life protection",
  Health: "Health & critical illness",
  Education: "Education funding",
  Retirement: "Retirement income",
  Income: "Income protection",
  Group: "Group benefits",
};

/**
 * Hero visual for a product primer: a lifestyle photo tinted by the brand
 * color, doubling as a click-to-watch video card (opens a YouTube search).
 */
export function ProductMedia({
  seed,
  accent,
  category,
  title,
  videoQuery,
}: {
  seed: string;
  accent: string;
  category: ProductCategory;
  title: string;
  videoQuery: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <a
      href={youtubeSearchUrl(videoQuery)}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-black/10"
      title="Watch explainer videos on YouTube"
    >
      {/* Photo or gradient fallback */}
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl(seed)}
          alt={`${title} — illustrative`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${accent}, #0a1027)`,
          }}
        >
          <ImageOff className="h-8 w-8 text-white/60" />
        </div>
      )}

      {/* Brand tint + legibility gradient */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-60"
        style={{ background: `linear-gradient(135deg, ${accent}, transparent 70%)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl transition group-hover:scale-110">
          <Play className="ml-0.5 h-7 w-7 fill-current text-navy-900" />
        </span>
      </div>

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-white drop-shadow">{title}</p>
          <p className="text-xs font-medium text-white/80">
            {CATEGORY_BLURB[category]}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/25 backdrop-blur">
          ▶ Watch explainer
        </span>
      </div>
    </a>
  );
}

/** Small thumbnail variant for product list cards. */
export function ProductThumb({
  seed,
  accent,
  className,
}: {
  seed: string;
  accent: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={className}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl(seed, 640, 360)}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="h-full w-full"
          style={{ background: `linear-gradient(135deg, ${accent}, #0a1027)` }}
        />
      )}
    </div>
  );
}
