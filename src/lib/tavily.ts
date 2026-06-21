/**
 * Tavily web-search client — server-side only.
 *
 * This is the "grounding" layer: an LLM like Llama 3.3 has no live data, so for
 * anything that must reflect the REAL world (real businesses, real prospects,
 * current facts) we search the web with Tavily first, then hand those real
 * results to Groq to synthesize. No key → we throw a clear error rather than
 * letting the model invent data.
 *
 * Get a free key (generous free tier) at https://app.tavily.com → put it in
 * .env.local as TAVILY_API_KEY.
 */

const TAVILY_URL = "https://api.tavily.com/search";

export type TavilyResult = {
  title: string;
  url: string;
  content: string;
  score: number;
};

export type TavilySearch = {
  answer: string | null;
  results: TavilyResult[];
};

export function hasTavily(): boolean {
  return !!process.env.TAVILY_API_KEY;
}

export async function tavilySearch(
  query: string,
  opts: {
    maxResults?: number;
    depth?: "basic" | "advanced";
    includeAnswer?: boolean;
    topic?: "general" | "news";
  } = {},
): Promise<TavilySearch> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error(
      "TAVILY_API_KEY is not set in .env.local — real web data needs a Tavily key (free at https://app.tavily.com).",
    );
  }

  const res = await fetch(TAVILY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      // api_key in body too, for compatibility with the legacy endpoint.
      api_key: apiKey,
      query,
      search_depth: opts.depth ?? "advanced",
      max_results: opts.maxResults ?? 8,
      include_answer: opts.includeAnswer ?? true,
      topic: opts.topic ?? "general",
    }),
    // Search results change slowly; let Next cache identical queries briefly.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Tavily request failed (${res.status}): ${detail.slice(0, 300)}`,
    );
  }

  const data = await res.json();
  return {
    answer: data?.answer ?? null,
    results: Array.isArray(data?.results)
      ? data.results.map((r: Record<string, unknown>) => ({
          title: String(r.title ?? ""),
          url: String(r.url ?? ""),
          content: String(r.content ?? ""),
          score: Number(r.score ?? 0),
        }))
      : [],
  };
}

/** Compact the search results into a numbered context block for an LLM prompt. */
export function formatResultsForPrompt(search: TavilySearch): string {
  const lines: string[] = [];
  if (search.answer) lines.push(`Search summary: ${search.answer}\n`);
  search.results.forEach((r, i) => {
    lines.push(
      `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content.slice(0, 500)}\n`,
    );
  });
  return lines.join("\n");
}
