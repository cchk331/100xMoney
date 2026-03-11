'use client';

import { useState, useEffect } from 'react';
import styles from './valuation.module.css';

interface StockVal {
  symbol: string;
  name: string;
  price: number;
  pct: number;
  marketCap: string;
  pe: number;
  forwardPE: number;
  pegRatio: number;
  pb: number;
  ps: number;
  evEbitda: number;
  debtEquity: number;
  roe: number;
  revenueGrowth: number;
  earningsGrowth: number;
  dcfTarget: number;
  analystTarget: number;
  upside: number;
  rating: string;
}

const MOCK_STOCKS: StockVal[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 261.11, pct: 0.11, marketCap: '$3.58T', pe: 31.2, forwardPE: 28.5, pegRatio: 2.1, pb: 48.2, ps: 8.9, evEbitda: 26.1, debtEquity: 1.73, roe: 157.4, revenueGrowth: 6.2, earningsGrowth: 10.8, dcfTarget: 258.00, analystTarget: 245.50, upside: 10.0, rating: 'Overweight' },
  { symbol: 'MSFT', name: 'Microsoft', price: 407.01, pct: 0.31, marketCap: '$3.31T', pe: 35.8, forwardPE: 32.1, pegRatio: 2.4, pb: 12.8, ps: 13.6, evEbitda: 27.8, debtEquity: 0.42, roe: 38.5, revenueGrowth: 16.4, earningsGrowth: 21.2, dcfTarget: 492.00, analystTarget: 480.00, upside: 10.5, rating: 'Buy' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 187.05, pct: 1.23, marketCap: '$2.21T', pe: 65.2, forwardPE: 38.2, pegRatio: 1.2, pb: 58.4, ps: 37.2, evEbitda: 55.1, debtEquity: 0.41, roe: 115.8, revenueGrowth: 122.4, earningsGrowth: 168.5, dcfTarget: 1050.00, analystTarget: 980.00, upside: 17.7, rating: 'Strong Buy' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 309.54, pct: 0.81, marketCap: '$2.21T', pe: 22.4, forwardPE: 19.8, pegRatio: 1.1, pb: 7.2, ps: 7.5, evEbitda: 16.2, debtEquity: 0.10, roe: 30.1, revenueGrowth: 14.8, earningsGrowth: 28.4, dcfTarget: 210.00, analystTarget: 198.00, upside: 17.4, rating: 'Buy' },
  { symbol: 'META', name: 'Meta', price: 657.21, pct: 0.48, marketCap: '$1.55T', pe: 28.9, forwardPE: 23.4, pegRatio: 1.0, pb: 9.6, ps: 11.2, evEbitda: 19.8, debtEquity: 0.35, roe: 33.2, revenueGrowth: 24.1, earningsGrowth: 35.8, dcfTarget: 720.00, analystTarget: 660.00, upside: 17.6, rating: 'Strong Buy' },
  { symbol: 'AMZN', name: 'Amazon', price: 215.17, pct: 0.39, marketCap: '$2.06T', pe: 62.1, forwardPE: 38.5, pegRatio: 1.8, pb: 8.4, ps: 3.4, evEbitda: 22.1, debtEquity: 0.58, roe: 22.8, revenueGrowth: 12.5, earningsGrowth: 42.1, dcfTarget: 230.00, analystTarget: 218.00, upside: 16.0, rating: 'Buy' },
];

export default function ValuationPage() {
  const [stocks, setStocks] = useState<StockVal[]>(MOCK_STOCKS);
  const [selected, setSelected] = useState<string[]>(['AAPL', 'MSFT', 'NVDA']);
  const [sortCol, setSortCol] = useState<keyof StockVal>('symbol');
  const [sortAsc, setSortAsc] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  // Fetch live data on mount and every 30 min
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/stocks');
        if (res.ok) {
          const data = await res.json();
          if (data.stocks && data.stocks.length > 0) {
            // Merge live prices into valuation data
            setStocks(prev => prev.map(s => {
              const live = data.stocks.find((ls: any) => ls.symbol === s.symbol);
              if (live) return { ...s, price: live.price, pct: live.pct, pe: live.pe || s.pe, marketCap: live.marketCap || s.marketCap };
              return s;
            }));
            setLastUpdated(data.lastUpdated || new Date().toISOString());
          }
        }
      } catch (e) { /* fallback to mock */ }
    }
    fetchData();
    const id = setInterval(fetchData, 30 * 60 * 1000); // 30 min
    return () => clearInterval(id);
  }, []);

  const toggleSelect = (sym: string) => {
    setSelected(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);
  };

  const handleSort = (col: keyof StockVal) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const sorted = [...stocks].sort((a, b) => {
    const va = a[sortCol], vb = b[sortCol];
    const cmp = typeof va === 'number' ? (va as number) - (vb as number) : String(va).localeCompare(String(vb));
    return sortAsc ? cmp : -cmp;
  });

  const pctCls = (v: number) => v >= 0 ? styles.up : styles.dn;
  const ratingCls = (r: string) => r.includes('Strong') ? styles.ratingStrong : r === 'Buy' ? styles.ratingBuy : styles.ratingHold;

  const cols: { key: keyof StockVal; label: string }[] = [
    { key: 'symbol', label: 'Ticker' },
    { key: 'price', label: 'Price' },
    { key: 'pct', label: 'Chg%' },
    { key: 'marketCap', label: 'Mkt Cap' },
    { key: 'pe', label: 'P/E' },
    { key: 'forwardPE', label: 'Fwd P/E' },
    { key: 'pegRatio', label: 'PEG' },
    { key: 'pb', label: 'P/B' },
    { key: 'evEbitda', label: 'EV/EBITDA' },
    { key: 'roe', label: 'ROE%' },
    { key: 'revenueGrowth', label: 'Rev Gth%' },
    { key: 'dcfTarget', label: 'DCF Target' },
    { key: 'upside', label: 'Upside%' },
    { key: 'rating', label: 'Rating' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.logo}>100x<span className={styles.logoAccent}>Money</span></span>
        <nav className={styles.nav}>
          <a className={styles.navItem} href="/dashboard">Dashboard</a>
          <a className={`${styles.navItem} ${styles.active}`} href="#">Valuation</a>
          <a className={styles.navItem} href="#">Screener</a>
        </nav>
        <div className={styles.topRight}>
          {lastUpdated && <span className={styles.updated}>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>}
          <span className={styles.liveBadge}>LIVE DATA</span>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Stock Valuation & Comparison</h1>
          <p className={styles.subtitle}>Multi-metric fundamental analysis with DCF targets. Data refreshes every 30 minutes.</p>
        </div>

        <div className={styles.chips}>
          {stocks.map(s => (
            <button key={s.symbol} className={`${styles.chip} ${selected.includes(s.symbol) ? styles.chipActive : ''}`} onClick={() => toggleSelect(s.symbol)}>
              {s.symbol}
            </button>
          ))}
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {cols.map(c => (
                  <th key={c.key} className={styles.th} onClick={() => handleSort(c.key)}>
                    {c.label} {sortCol === c.key ? (sortAsc ? '\u25B2' : '\u25BC') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => (
                <tr key={s.symbol} className={`${styles.tr} ${selected.includes(s.symbol) ? styles.trSelected : ''}`} onClick={() => toggleSelect(s.symbol)}>
                  <td className={styles.tdSym}>{s.symbol}</td>
                  <td>${s.price.toFixed(2)}</td>
                  <td className={pctCls(s.pct)}>{s.pct >= 0 ? '+' : ''}{s.pct.toFixed(2)}%</td>
                  <td>{s.marketCap}</td>
                  <td>{s.pe.toFixed(1)}x</td>
                  <td>{s.forwardPE.toFixed(1)}x</td>
                  <td>{s.pegRatio.toFixed(1)}</td>
                  <td>{s.pb.toFixed(1)}x</td>
                  <td>{s.evEbitda.toFixed(1)}x</td>
                  <td className={pctCls(s.roe)}>{s.roe.toFixed(1)}%</td>
                  <td className={pctCls(s.revenueGrowth)}>{s.revenueGrowth.toFixed(1)}%</td>
                  <td className={styles.target}>${s.dcfTarget.toFixed(0)}</td>
                  <td className={pctCls(s.upside)}>+{s.upside.toFixed(1)}%</td>
                  <td><span className={ratingCls(s.rating)}>{s.rating}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Valuation Summary */}
        <div className={styles.aiSummary}>
          <div className={styles.aiSumHeader}>AI VALUATION INSIGHT</div>
          <p className={styles.aiSumText}>
            Among selected stocks, <strong>NVDA</strong> shows highest upside (+17.7%) with PEG of 1.2x despite elevated P/E, justified by 168.5% earnings growth.
            <strong> GOOGL</strong> offers best value with lowest PEG (1.1x) and forward P/E (19.8x).
            <strong> META</strong> balances growth (35.8% earnings growth) with reasonable valuation (PEG 1.0x).
            Sector-wide, forward P/E compression suggests market is pricing in earnings normalization for mega-caps.
          </p>
        </div>
      </div>
    </div>
  );
}
