import { NextResponse } from 'next/server';

// Finnhub API configuration
const FINNHUB_KEY = process.env.FINNHUB_API_KEY || '';
const BASE = 'https://finnhub.io/api/v1';

// Cache: stores fetched data + timestamp
let cache: { data: any; ts: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in ms

const SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META'];

const STOCK_META: Record<string, { name: string }> = {
  AAPL: { name: 'Apple Inc.' },
  MSFT: { name: 'Microsoft' },
  NVDA: { name: 'NVIDIA' },
  TSLA: { name: 'Tesla' },
  AMZN: { name: 'Amazon' },
  GOOGL: { name: 'Alphabet' },
  META: { name: 'Meta' },
};

// Fallback mock data when API key is missing or rate-limited
const FALLBACK_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 261.11, change: 0.28, pct: 0.11, marketCap: '$3.84T', pe: 33.5, eps: 7.79, divYield: '0.48%', high52: 260.10, low52: 164.08, avgVol: '52.1M', beta: 1.24 },
  { symbol: 'MSFT', name: 'Microsoft', price: 407.01, change: 1.25, pct: 0.31, marketCap: '$3.03T', pe: 32.1, eps: 12.68, divYield: '0.78%', high52: 555.45, low52: 344.79, avgVol: '22.4M', beta: 0.92 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 187.05, change: 2.28, pct: 1.23, marketCap: '$4.55T', pe: 48.6, eps: 3.85, divYield: '0.01%', high52: 212.19, low52: 86.62, avgVol: '176.1M', beta: 1.68 },
  { symbol: 'TSLA', name: 'Tesla', price: 411.90, change: 12.66, pct: 3.17, marketCap: '$1.55T', pe: 152.3, eps: 2.70, divYield: '-', high52: 488.54, low52: 138.80, avgVol: '98.5M', beta: 2.05 },
  { symbol: 'AMZN', name: 'Amazon', price: 215.17, change: 0.84, pct: 0.39, marketCap: '$2.31T', pe: 38.2, eps: 5.63, divYield: '-', high52: 242.52, low52: 151.61, avgVol: '44.2M', beta: 1.15 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 309.54, change: 2.49, pct: 0.81, marketCap: '$3.74T', pe: 21.8, eps: 14.19, divYield: '0.26%', high52: 311.00, low52: 148.71, avgVol: '25.6M', beta: 1.08 },
  { symbol: 'META', name: 'Meta', price: 657.21, change: 3.14, pct: 0.48, marketCap: '$1.67T', pe: 25.4, eps: 25.88, divYield: '0.30%', high52: 796.25, low52: 479.80, avgVol: '15.8M', beta: 1.23 },
];

const FALLBACK_INDICES = [
  { symbol: 'SPX', value: '6,786.34', change: '+0.07%', up: true },
  { symbol: 'DJIA', value: '47,486.60', change: '-0.46%', up: false },
  { symbol: 'IXIC', value: '22,815.11', change: '+0.52%', up: true },
  { symbol: 'VIX', value: '24.28', change: '-2.61%', up: false },
  { symbol: 'US10Y', value: '4.28%', change: '-0.5%', up: false },
  { symbol: 'BTC', value: '95,362', change: '+1.21%', up: true },
];

async function finnhubQuote(symbol: string): Promise<any> {
  const res = await fetch(`${BASE}/quote?symbol=${symbol}&token=${FINNHUB_KEY}`);
  if (!res.ok) throw new Error(`Finnhub quote ${symbol}: ${res.status}`);
  return res.json();
}

async function finnhubMetrics(symbol: string): Promise<any> {
  const res = await fetch(`${BASE}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`);
  if (!res.ok) throw new Error(`Finnhub metrics ${symbol}: ${res.status}`);
  return res.json();
}

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(0)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(0)}M`;
  return `$${cap}`;
}

function formatVolume(vol: number): string {
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(0)}K`;
  return `${vol}`;
}

async function fetchLiveData() {
  if (!FINNHUB_KEY) {
    console.log('No FINNHUB_API_KEY set, using fallback data');
    return { stocks: FALLBACK_STOCKS, indices: FALLBACK_INDICES };
  }

  try {
    const stocks = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const [quote, metricsRes] = await Promise.all([
          finnhubQuote(symbol),
          finnhubMetrics(symbol),
        ]);
        const m = metricsRes.metric || {};
        return {
          symbol,
          name: STOCK_META[symbol]?.name || symbol,
          price: quote.c || 0,
          change: quote.d || 0,
          pct: quote.dp || 0,
          marketCap: formatMarketCap(m.marketCapitalization ? m.marketCapitalization * 1e6 : 0),
          pe: m.peNormalizedAnnual || m.peTTM || 0,
          eps: m.epsNormalizedAnnual || m.epsTTM || 0,
          divYield: m.dividendYieldIndicatedAnnual ? m.dividendYieldIndicatedAnnual.toFixed(2) + '%' : '-',
          high52: m['52WeekHigh'] || 0,
          low52: m['52WeekLow'] || 0,
          avgVol: formatVolume(m['10DayAverageTradingVolume'] ? m['10DayAverageTradingVolume'] * 1e6 : 0),
          beta: m.beta || 0,
        };
      })
    );

    // Fetch index quotes
    const indexSymbols = ['^GSPC', '^DJI', '^IXIC'];
    const indexNames = ['SPX', 'DJIA', 'IXIC'];
    const indexQuotes = await Promise.all(
      indexSymbols.map((s) => finnhubQuote(s).catch(() => null))
    );

    const indices = indexQuotes.map((q, i) => {
      if (!q || !q.c) return FALLBACK_INDICES[i];
      const pct = q.dp || 0;
      return {
        symbol: indexNames[i],
        value: q.c.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        change: (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%',
        up: pct >= 0,
      };
    });

    // Add VIX, US10Y, BTC from fallback (Finnhub free tier may not cover all)
    indices.push(...FALLBACK_INDICES.slice(3));

    return { stocks, indices };
  } catch (error) {
    console.error('Finnhub API error, falling back to mock data:', error);
    return { stocks: FALLBACK_STOCKS, indices: FALLBACK_INDICES };
  }
}

export async function GET() {
  // Return cached data if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const data = await fetchLiveData();
  cache = { data, ts: Date.now() };
  return NextResponse.json(data);
}
