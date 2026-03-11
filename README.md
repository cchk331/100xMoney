# 100xMoney

> AI-powered stock research platform with real-time valuation, earnings analysis, and smart portfolio tools.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## Overview

100xMoney is a modern, AI-first stock research platform that helps long-term investors make smarter decisions. It combines real-time market data, advanced valuation models, earnings call analysis, and AI-powered insights into a single, beautiful interface.

## Features

### Core Research Tools
- **Stock Dashboard** - Customizable drag-and-drop widgets with watchlists and market movers
- **Valuation Engine** - DCF, comps, and dividend discount models with interactive scenario modeling
- **Stock Comparison** - Compare up to 5 stocks with radar charts and weighted scoring
- **Earnings Transcripts** - Full transcripts with AI summaries, sentiment tags, and searchable quotes
- **SEC Filings Browser** - AI-powered summarization with red-flag detection
- **Price Projections** - Monte Carlo simulations with bull/base/bear probability bands
- **Real-Time Quotes** - WebSocket-powered sub-second price updates

### AI-Powered Features
- **AI Research Copilot** - Chat-based assistant for any stock query
- **Sentiment Analyzer** - Aggregates sentiment from news, Reddit, and X
- **Investment Thesis Generator** - Auto-generates bull/bear cases with data
- **Smart Alerts** - Detects fundamental shifts, not just price targets
- **Portfolio Risk Analyzer** - Evaluates concentration, correlation, and sector exposure

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS + Shadcn/UI |
| Backend API | FastAPI (Python 3.12) |
| Database | PostgreSQL 16 + Redis 7 + ClickHouse |
| Auth | Clerk |
| Real-Time | WebSockets + Redis Pub/Sub |
| AI/ML | OpenAI API + LangChain |
| Infrastructure | AWS (ECS/Fargate) + Terraform |
| CI/CD | GitHub Actions |
| Dev Environment | GitHub Codespaces |

## Project Structure

```
100xMoney/
├── .devcontainer/          # GitHub Codespaces configuration
│   ├── devcontainer.json
│   ├── docker-compose.yml
│   └── post-create.sh
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI pipeline
│       └── deploy.yml      # CD pipeline
├── frontend/               # Next.js 15 application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   │   ├── ui/         # Shadcn/UI components
│   │   │   ├── dashboard/  # Dashboard widgets
│   │   │   ├── charts/     # Chart components
│   │   │   └── layout/     # Layout components
│   │   ├── lib/            # Utilities and helpers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand state management
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   │   ├── v1/
│   │   │   │   ├── stocks.py
│   │   │   │   ├── earnings.py
│   │   │   │   ├── valuations.py
│   │   │   │   ├── portfolios.py
│   │   │   │   └── ai.py
│   │   ├── core/           # Core config and security
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic/            # Database migrations
├── ai-engine/              # AI/ML service
│   ├── app/
│   │   ├── agents/         # LangChain agents
│   │   ├── prompts/        # Prompt templates
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml      # Local development services
├── docker-compose.prod.yml # Production services
└── README.md
```

## Getting Started

### Prerequisites
- GitHub account with Codespaces access
- Node.js 20+ (auto-installed in Codespaces)
- Python 3.12+ (auto-installed in Codespaces)

### Quick Start with GitHub Codespaces

1. Click the green **Code** button on this repo
2. Select **Codespaces** tab
3. Click **Create codespace on main**
4. Wait for the dev container to build (~2 minutes)
5. Everything is auto-configured and ready to go!

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/cchk331/100xMoney.git
cd 100xMoney

# Start infrastructure services
docker-compose up -d

# Install frontend dependencies
cd frontend && npm install && npm run dev

# Install backend dependencies (new terminal)
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 4000

# Install AI engine dependencies (new terminal)
cd ai-engine && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hundredxmoney
REDIS_URL=redis://localhost:6379

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# AI
OPENAI_API_KEY=sk-xxx

# Market Data
ALPHA_VANTAGE_API_KEY=xxx
FINNHUB_API_KEY=xxx
```

## Development Ports

| Service | Port |
|---|---|
| Frontend (Next.js) | 3000 |
| Backend API (FastAPI) | 4000 |
| AI Engine | 8000 |
| PostgreSQL | 5432 |
| Redis | 6379 |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [x] Project setup and architecture
- [ ] Core dashboard with real-time quotes
- [ ] Valuation engine (DCF, comps)
- [ ] Earnings transcript viewer with AI summaries
- [ ] SEC filings browser
- [ ] AI Research Copilot
- [ ] Portfolio risk analyzer
- [ ] Mobile app (React Native)
- [ ] Public launch

---

Built with conviction by the 100xMoney team.
