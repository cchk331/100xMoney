'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './dashboard.module.css';

// Types
interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  pct: number;
  marketCap: string;
  pe: number;
  eps: number;
  divYield: string;
  high52: number;
  low52: number;
  avgVol: string;
  beta: number;
}

interface NewsItem {
  time: string;
  headline: string;
  source: string;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

// Data
const STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 234.56, change: 2.87, pct: 1.24, marketCap: '$3.58T', pe: 31.2, eps: 7.52, divYield: '0.52%', high52: 248.23, low52: 164.08, avgVol: '58.2M', beta: 1.24 },
  { symbol: 'MSFT', name: 'Microsoft', price: 445.12, change: 3.91, pct: 0.89, marketCap: '$3.31T', pe: 35.8, eps: 12.43, divYield: '0.71%', high52: 468.35, low52: 362.90, avgVol: '22.1M', beta: 0.92 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 892.45, change: 20.12, pct: 2.31, marketCap: '$2.21T', pe: 65.2, eps: 13.69, divYield: '0.02%', high52: 974.00, low52: 473.20, avgVol: '45.8M', beta: 1.68 },
  { symbol: 'TSLA', name: 'Tesla', price: 267.89, change: -3.95, pct: -1.45, marketCap: '$852B', pe: 78.4, eps: 3.42, divYield: '-', high52: 299.29, low52: 138.80, avgVol: '98.5M', beta: 2.05 },
  { symbol: 'AMZN', name: 'Amazon', price: 198.34, change: 1.32, pct: 0.67, marketCap: '$2.06T', pe: 62.1, eps: 3.19, divYield: '-', high52: 201.20, low52: 151.61, avgVol: '44.2M', beta: 1.15 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 178.90, change: -0.57, pct: -0.32, marketCap: '$2.21T', pe: 22.4, eps: 7.99, divYield: '-', high52: 191.75, low52: 130.67, avgVol: '25.6M', beta: 1.08 },
  { symbol: 'META', name: 'Meta', price: 612.45, change: 10.72, pct: 1.78, marketCap: '$1.55T', pe: 28.9, eps: 21.19, divYield: '0.33%', high52: 638.40, low52: 414.50, avgVol: '15.8M', beta: 1.23 },
];

const NEWS: NewsItem[] = [
  { time: '14:32', headline: 'Fed signals potential rate cut in Q2 2026', source: 'Reuters' },
  { time: '13:45', headline: 'NVDA reports record datacenter revenue, beats estimates', source: 'Bloomberg' },
  { time: '12:18', headline: 'Treasury yields fall to 3-month low amid economic data', source: 'CNBC' },
  { time: '11:05', headline: 'Apple Vision Pro 2 launch drives services revenue growth', source: 'WSJ' },
  { time: '09:30', headline: 'S&P 500 opens at all-time high on tech rally', source: 'MarketWatch' },
];

const INDICES = [
  { symbol: 'SPX', value: '5,892.34', change: '+0.82%', up: true },
  { symbol: 'DJIA', value: '43,156.78', change: '+0.45%', up: true },
  { symbol: 'IXIC', value: '19,234.56', change: '+1.12%', up: true },
  { symbol: 'VIX', value: '14.23', change: '-3.1%', up: false },
  { symbol: 'US10Y', value: '4.21%', change: '-0.8%', up: false },
  { symbol: 'BTC', value: '97,432', change: '+2.4%', up: true },
];

const FINANCE_KEYWORDS = ['stock','price','p/e','pe','ratio','market','cap','revenue','earnings','dividend','yield','eps','valuation','bull','bear','sector','etf','bond','treasury','inflation','gdp','fed','rate','ipo','crypto','bitcoin','portfolio','risk','hedge','option','futures','forex','gold','oil','debt','equity','roi','profit','margin','growth','vol','beta','alpha','aapl','msft','nvda','tsla','amzn','googl','meta','nasdaq','dow','index','fund','forecast','target','analyst','buy','sell','hold'];

function isFinanceQuestion(q: string): boolean {
  const lower = q.toLowerCase();
  return FINANCE_KEYWORDS.some(k => lower.includes(k));
}

function getAIResponse(q: string): string {
  const l = q.toLowerCase();
  if (l.includes('aapl') || l.includes('apple')) return 'AAPL trailing P/E: 31.2x vs 5yr avg 27.8x. Forward P/E: 28.5x. Market Cap $3.58T. Strong services growth + AI integration driving premium valuation. Revenue TTM $401.8B (+6.2% YoY).';
  if (l.includes('msft') || l.includes('microsoft')) return 'MSFT at $445.12, P/E 35.8x. Azure cloud growth +29% YoY. Forward P/E 32.1x. Market Cap $3.31T. Copilot AI monetization accelerating.';
  if (l.includes('nvda') || l.includes('nvidia')) return 'NVDA at $892.45, P/E 65.2x. Datacenter revenue up 409% YoY. AI chip demand remains exceptional. Forward P/E 38.2x on expected earnings growth.';
  if (l.includes('market') || l.includes('s&p') || l.includes('sp500')) return 'S&P 500 at 5,892 (+0.82%). Breadth improving with 73% above 200-day MA. VIX at 14.23, low fear. Earnings growth est. +12% for 2026.';
  return 'Based on current data, valuations are mixed across sectors. Growth trades at premium multiples while value shows more reasonable P/E ratios. What specific stock or metric would you like me to analyze?';
}

export default function Dashboard() {
  const [selectedStock, setSelectedStock] = useState<Stock>(STOCKS[0]);
  const [timeframe, setTimeframe] = useState('1D');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Welcome to 100xMoney AI. I assist with stock analysis, valuations, earnings, portfolio strategy & market research.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [clock, setClock] = useState('');
  const [liveStocks, setLiveStocks] = useState<Stock[]>(STOCKS);
  const [liveIndices, setLiveIndices] = useState(INDICES);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' }) + ' EST');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Live data fetch from API
  useEffect(() => {
    async function fetchLiveData() {
      try {
        const res = await fetch('/api/stocks');
        if (res.ok) {
          const data = await res.json();
          if (data.stocks) setLiveStocks(data.stocks);
          if (data.indices) setLiveIndices(data.indices);
        }
      } catch (e) {
        // Fallback to mock data silently
      }
    }
    fetchLiveData();
    const id = setInterval(fetchLiveData, 15000); // Refresh every 15s
    return () => clearInterval(id);
  }, []);

  const sendChat = useCallback(() => {
    const q = chatInput.trim();
    if (!q) return;
    const newMsgs = [...chatMessages, { role: 'user' as const, text: q }];
    setChatInput('');
    if (!isFinanceQuestion(q)) {
      setChatMessages([...newMsgs, { role: 'bot', text: 'I can only assist with finance-related questions - stocks, valuations, earnings, portfolio & markets. Please ask a finance question.' }]);
    } else {
      setChatMessages([...newMsgs, { role: 'bot', text: getAIResponse(q) }]);
    }
  }, [chatInput, chatMessages]);

  const pctClass = (v: number) => v >= 0 ? styles.up : styles.dn;
  const fmtPct = (v: number) => (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
  const fmtChg = (v: number) => (v >= 0 ? '+' : '') + v.toFixed(2);

  return (
    <div className={styles.app}>
      {/* Top Bar */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.logo}>100x<span className={styles.logoAccent}>Money</span></span>
          <nav className={styles.nav}>
            <a className={`${styles.navItem} ${styles.active}`} href="#">Dashboard</a>
            <a className={styles.navItem} href="/valuation">Valuation</a>
            <a className={styles.navItem} href="#">Screener</a>
            <a className={styles.navItem} href="#">Watchlist</a>
          </nav>
        </div>
        <div className={styles.tickerTape}>
          {liveIndices.map(idx => (
            <span key={idx.symbol} className={styles.tick}>
              <b>{idx.symbol}</b> {idx.value} <em className={idx.up ? styles.up : styles.dn}>{idx.change}</em>
            </span>
          ))}
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.marketOpen}>MKT OPEN</span>
          <span className={styles.clock}>{clock}</span>
          <button className={styles.btnPro}>PRO</button>
        </div>
      </header>

      {/* Main Layout */}
      <div className={styles.main}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.searchBox}>
            <input className={styles.searchInput} placeholder="Search stocks, ETFs, crypto..." />
          </div>
          <div className={styles.panelHeader}><span>WATCHLIST</span><button className={styles.btnSm}>+ ADD</button></div>
          <div className={styles.wlTable}>
            {liveStocks.map(s => (
              <div key={s.symbol} className={`${styles.wlRow} ${selectedStock.symbol === s.symbol ? styles.wlActive : ''}`} onClick={() => setSelectedStock(s)}>
                <span className={styles.wlSym}>{s.symbol}</span>
                <span className={styles.wlPrice}>{s.price.toFixed(2)}</span>
                <span className={`${styles.wlChg} ${pctClass(s.pct)}`}>{fmtPct(s.pct)}</span>
              </div>
            ))}
          </div>
          <div className={styles.panelHeader}><span>PORTFOLIO</span></div>
          <div className={styles.portValue}>
            <div className={styles.portLabel}>Total Value</div>
            <div className={styles.portAmount}>$287,432</div>
            <div className={`${styles.portChange} ${styles.up}`}>+$4,231 (+1.49%) Today</div>
          </div>
          <div className={styles.portStats}>
            <div className={styles.portStat}><span className={styles.psLabel}>Positions</span><span className={styles.psVal}>14</span></div>
            <div className={styles.portStat}><span className={styles.psLabel}>Cash</span><span className={styles.psVal}>$12,450</span></div>
            <div className={styles.portStat}><span className={styles.psLabel}>Day P&L</span><span className={`${styles.psVal} ${styles.up}`}>+$4,231</span></div>
            <div className={styles.portStat}><span className={styles.psLabel}>Total P&L</span><span className={`${styles.psVal} ${styles.up}`}>+$43,892</span></div>
          </div>
        </aside>

        {/* Center Content */}
        <section className={styles.content}>
          <div className={styles.stockHeader}>
            <div>
              <h1 className={styles.stockName}>{selectedStock.symbol} <span className={styles.stockCo}>{selectedStock.name}</span></h1>
              <div className={styles.priceRow}>
                <span className={styles.bigPrice}>${selectedStock.price.toFixed(2)}</span>
                <span className={`${styles.bigChange} ${pctClass(selectedStock.pct)}`}>{fmtChg(selectedStock.change)} ({fmtPct(selectedStock.pct)})</span>
              </div>
            </div>
            <div className={styles.timeframes}>
              {['1D','1W','1M','3M','1Y','5Y'].map(tf => (
                <button key={tf} className={`${styles.tf} ${timeframe === tf ? styles.tfActive : ''}`} onClick={() => setTimeframe(tf)}>{tf}</button>
              ))}
            </div>
          </div>

          <div className={styles.chartArea}>
            <svg viewBox="0 0 800 200" className={styles.chartSvg}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d="M0,150 C50,140 100,145 150,120 C200,95 250,100 300,80 C350,60 400,70 450,50 C500,55 550,40 600,35 C650,45 700,30 750,25 L800,20" fill="none" stroke="#22c55e" strokeWidth="2" />
              <path d="M0,150 C50,140 100,145 150,120 C200,95 250,100 300,80 C350,60 400,70 450,50 C500,55 550,40 600,35 C650,45 700,30 750,25 L800,20 L800,200 L0,200Z" fill="url(#cg)" />
            </svg>
            <div className={styles.chartLabels}>
              <span>9:30</span><span>10:30</span><span>11:30</span><span>12:30</span><span>1:30</span><span>2:30</span><span>3:30</span>
            </div>
          </div>

          <div className={styles.metricsGrid}>
            {[
              { label: 'Market Cap', value: selectedStock.marketCap },
              { label: 'P/E (TTM)', value: selectedStock.pe + 'x' },
              { label: 'EPS (TTM)', value: '$' + selectedStock.eps.toFixed(2) },
              { label: 'Div Yield', value: selectedStock.divYield },
              { label: '52W High', value: '$' + selectedStock.high52.toFixed(2) },
              { label: '52W Low', value: '$' + selectedStock.low52.toFixed(2) },
              { label: 'Avg Volume', value: selectedStock.avgVol },
              { label: 'Beta', value: selectedStock.beta.toFixed(2) },
            ].map(m => (
              <div key={m.label} className={styles.metricCard}>
                <div className={styles.mcLabel}>{m.label}</div>
                <div className={styles.mcValue}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className={styles.newsSection}>
            <div className={styles.panelHeader}><span>MARKET NEWS</span><span className={styles.liveDot}>LIVE</span></div>
            {NEWS.map((n, i) => (
              <div key={i} className={styles.newsItem}>
                <span className={styles.newsTime}>{n.time}</span>
                <div><div className={styles.newsTitle}>{n.headline}</div><div className={styles.newsSrc}>{n.source}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Copilot */}
        <aside className={styles.aiPanel}>
          <div className={styles.aiHeader}>
            <span className={styles.aiTitle}>AI Finance Copilot</span>
            <span className={styles.aiBadge}>Finance Only</span>
          </div>
          <div className={styles.aiMessages}>
            {chatMessages.map((m, i) => (
              <div key={i} className={`${styles.aiMsg} ${m.role === 'bot' ? styles.aiBot : styles.aiUser}`}>
                <div className={styles.aiSender}>{m.role === 'bot' ? 'AI Copilot' : 'You'}</div>
                <div className={styles.aiText} dangerouslySetInnerHTML={{ __html: m.text }} />
              </div>
            ))}
          </div>
          <div className={styles.aiInputRow}>
            <input className={styles.aiInput} placeholder="Ask a finance question..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} />
            <button className={styles.aiSend} onClick={sendChat}>Send</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
