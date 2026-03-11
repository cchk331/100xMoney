'use client';

import { useState } from 'react';
import { AIChatPanel } from '@/components/ai/AIChatPanel';

const mockWatchlist = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 234.56, change: 2.34, pct: 1.01 },
  { symbol: 'MSFT', name: 'Microsoft', price: 445.12, change: -1.23, pct: -0.28 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 892.45, change: 15.67, pct: 1.79 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 178.90, change: 0.45, pct: 0.25 },
  { symbol: 'AMZN', name: 'Amazon', price: 198.34, change: -2.11, pct: -1.05 },
  { symbol: 'TSLA', name: 'Tesla', price: 267.89, change: 8.92, pct: 3.45 },
];

const mockNews = [
  { time: '14:32', headline: 'Fed signals potential rate cut in Q2 2026', source: 'Reuters' },
  { time: '13:45', headline: 'NVDA reports record datacenter revenue', source: 'Bloomberg' },
  { time: '12:18', headline: 'Treasury yields fall to 3-month low', source: 'CNBC' },
  { time: '11:02', headline: 'Oil prices surge on OPEC production cuts', source: 'WSJ' },
  { time: '09:30', headline: 'S&P 500 opens at all-time high', source: 'MarketWatch' },
];

export default function DashboardPage() {
  const [showAI, setShowAI] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-[hsl(220,20%,4%)] text-[hsl(210,20%,90%)] overflow-hidden">
      {/* Top Bar - Bloomberg style */}
      <header className="flex items-center justify-between px-4 h-10 bg-[hsl(220,18%,6%)] border-b border-[hsl(220,14%,14%)] shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold ai-gradient-text">100xMoney</span>
          <span className="market-open text-emerald-400">Market Open</span>
          <span className="text-xs text-gray-500 font-mono-data">S&P 500: 5,892.34 (+0.82%)</span>
          <span className="text-xs text-gray-500 font-mono-data">DJIA: 43,156.78 (+0.45%)</span>
          <span className="text-xs text-gray-500 font-mono-data">NASDAQ: 19,234.56 (+1.12%)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAI(!showAI)}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              showAI
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 ai-glow'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            AI Copilot
          </button>
          <span className="text-xs text-gray-500">PRO</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <aside className="w-12 bg-[hsl(220,18%,5%)] border-r border-[hsl(220,14%,14%)] flex flex-col items-center py-3 gap-4 shrink-0">
          <button className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center" title="Dashboard">D</button>
          <button className="w-8 h-8 rounded hover:bg-gray-800 text-gray-500 text-xs flex items-center justify-center" title="Watchlist">W</button>
          <button className="w-8 h-8 rounded hover:bg-gray-800 text-gray-500 text-xs flex items-center justify-center" title="Valuation">V</button>
          <button className="w-8 h-8 rounded hover:bg-gray-800 text-gray-500 text-xs flex items-center justify-center" title="Earnings">E</button>
          <button className="w-8 h-8 rounded hover:bg-gray-800 text-gray-500 text-xs flex items-center justify-center" title="SEC Filings">S</button>
          <button className="w-8 h-8 rounded hover:bg-gray-800 text-gray-500 text-xs flex items-center justify-center" title="Compare">C</button>
        </aside>

        {/* Center Content */}
        <main className="flex-1 overflow-auto scrollbar-bloomberg p-3 grid grid-cols-2 grid-rows-[auto_1fr_1fr] gap-3">
          {/* Command Bar */}
          <div className="col-span-2">
            <div className="command-bar">
              <span className="text-emerald-400 text-sm">&gt;</span>
              <input placeholder="Search stocks, ask AI, run commands... (Ctrl+K)" />
            </div>
          </div>

          {/* Watchlist Panel */}
          <div className="bloomberg-panel overflow-hidden flex flex-col">
            <div className="bloomberg-header">
              <span>Watchlist</span>
              <button className="text-emerald-400 hover:text-emerald-300">+ Add</button>
            </div>
            <div className="flex-1 overflow-auto scrollbar-bloomberg">
              <table className="data-grid">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Change</th>
                    <th className="text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {mockWatchlist.map((stock) => (
                    <tr key={stock.symbol} className="cursor-pointer">
                      <td>
                        <div className="font-semibold text-white">{stock.symbol}</div>
                        <div className="text-xs text-gray-500">{stock.name}</div>
                      </td>
                      <td className="text-right font-mono-data">${stock.price.toFixed(2)}</td>
                      <td className={`text-right ${stock.change >= 0 ? 'ticker-positive' : 'ticker-negative'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </td>
                      <td className={`text-right ${stock.pct >= 0 ? 'ticker-positive' : 'ticker-negative'}`}>
                        {stock.pct >= 0 ? '+' : ''}{stock.pct.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Panel (placeholder) */}
          <div className="bloomberg-panel overflow-hidden flex flex-col">
            <div className="bloomberg-header">
              <span>AAPL - Apple Inc.</span>
              <div className="flex gap-2">
                <button className="text-emerald-400 text-[10px]">1D</button>
                <button className="text-gray-500 text-[10px]">1W</button>
                <button className="text-gray-500 text-[10px]">1M</button>
                <button className="text-gray-500 text-[10px]">1Y</button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-600">
              <div className="text-center">
                <div className="text-4xl font-bold font-mono-data text-white">$234.56</div>
                <div className="ticker-positive text-lg">+2.34 (+1.01%)</div>
                <div className="text-xs text-gray-500 mt-2">[Chart renders here with Recharts]</div>
              </div>
            </div>
          </div>

          {/* News Feed Panel */}
          <div className="bloomberg-panel overflow-hidden flex flex-col">
            <div className="bloomberg-header">
              <span>Market News</span>
              <span className="text-xs text-gray-600">Live</span>
            </div>
            <div className="flex-1 overflow-auto scrollbar-bloomberg">
              {mockNews.map((item, i) => (
                <div key={i} className="px-3 py-2.5 border-b border-[hsl(220,14%,14%)] hover:bg-[hsl(220,14%,9%)] cursor-pointer">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 font-mono-data shrink-0 mt-0.5">{item.time}</span>
                    <div>
                      <p className="text-sm text-gray-200 leading-snug">{item.headline}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.source}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Summary Panel */}
          <div className="bloomberg-panel overflow-hidden flex flex-col">
            <div className="bloomberg-header">
              <span>Portfolio Summary</span>
              <span className="ticker-positive text-xs">+$4,231.45 today</span>
            </div>
            <div className="flex-1 p-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 uppercase">Total Value</div>
                <div className="text-2xl font-bold font-mono-data text-white">$287,432</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Day P&L</div>
                <div className="text-2xl font-bold font-mono-data ticker-positive">+1.49%</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Positions</div>
                <div className="text-lg font-mono-data">14</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Cash</div>
                <div className="text-lg font-mono-data">$12,568</div>
              </div>
            </div>
          </div>
        </main>

        {/* AI Chat Panel - Right Sidebar */}
        {showAI && (
          <AIChatPanel onClose={() => setShowAI(false)} />
        )}
      </div>
    </div>
  );
}
