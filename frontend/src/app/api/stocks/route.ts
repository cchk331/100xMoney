import { NextResponse } from 'next/server';

// Cache: stores fetched data + timestamp
let cache: { data: any; ts: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in ms

const SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META'];
const INDEX_SYMBOLS = ['^GSPC', '^DJI', '^IXIC', '^VIX'];

interface QuoteResult {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  marketCap?: number;
  trailingPE?: number;
  epsTrailingTwelveMonths?: number;
  dividendYield?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  averageDailyVolume3Month?: number;
  beta?: number;
}

function formatMarketCap(cap: number | undefined): string {
  if (!cap) return '-';
  if (cap >= 1e12) return '$' + (cap / 1e12).toFixed(2) + 'T';
  if (cap >= 1e9) return '$' + (cap / 1e9).toFixed(0) + 'B';
  if (cap >= 1e6) return '$' + (cap / 1e6).toFixed(0) + 'M';
  return '$' + cap.toString();
}

function formatVolume(vol: number | undefined): string {
  if (!vol) return '-';
  if (vol >= 1e6) return (vol / 1e6).toFixed(1) + 'M';
  if (vol >= 1e3) return (vol / 1e3).toFixed(0) + 'K';
  return vol.toString();
}

const INDEX_MAP: Record<string, string> = {
  '^GSPC': 'SPX',
  '^DJI': 'DJIA',
  '^IXIC': 'IXIC',
  '^VIX': 'VIX',
};

async function fetchYahooQuotes(symbols: string[]): Promise<QuoteResult[]> {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Yahoo API returned ${res.status}`);
  const json = await res.json();
  return json?.quoteResponse?.result || [];
}

async function fetchLiveData() {
  // Check cache validity
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return cache.data;
  }

  try {
    const [stockQuotes, indexQuotes] = await Promise.all([
      fetchYahooQuotes(SYMBOLS),
      fetchYahooQuotes(INDEX_SYMBOLS),
    ]);

    const stocks = stockQuotes.map((q: QuoteResult) => ({
      symbol: q.symbol || '',
      name: q.shortName || q.symbol || '',
      price: q.regularMarketPrice || 0,
      change: q.regularMarketChange || 0,
      pct: q.regularMarketChangePercent || 0,
      marketCap: formatMarketCap(q.marketCap),
      pe: Number((q.trailingPE || 0).toFixed(1)),
      eps: Number((q.epsTrailingTwelveMonths || 0).toFixed(2)),
      divYield: q.dividendYield ? (q.dividendYield * 100).toFixed(2) + '%' : '-',
      high52: q.fiftyTwoWeekHigh || 0,
      low52: q.fiftyTwoWeekLow || 0,
      avgVol: formatVolume(q.averageDailyVolume3Month),
      beta: Number((q.beta || 0).toFixed(2)),
    }));

    const indices = indexQuotes.map((q: QuoteResult) => ({
      symbol: INDEX_MAP[q.symbol || ''] || q.symbol || '',
      value: (q.regularMarketPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }),
      change: (q.regularMarketChangePercent || 0) >= 0
        ? '+' + (q.regularMarketChangePercent || 0).toFixed(2) + '%'
        : (q.regularMarketChangePercent || 0).toFixed(2) + '%',
      up: (q.regularMarketChangePercent || 0) >= 0,
    }));

    const result = {
      stocks,
      indices,
      lastUpdated: new Date().toISOString(),
      source: 'live',
    };

    // Update cache
    cache = { data: result, ts: Date.now() };
    return result;
  } catch (error) {
    console.error('Failed to fetch live data:', error);
    // Return cached data if available, even if stale
    if (cache) return { ...cache.data, source: 'cache-stale' };
    // Final fallback: return null so frontend uses mock data
    return null;
  }
}

export async function GET() {
  const data = await fetchLiveData();
  if (!data) {
    return NextResponse.json(
      { error: 'Unable to fetch live data', source: 'fallback' },
      { status: 503 }
    );
  }
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
    },
  });
}
