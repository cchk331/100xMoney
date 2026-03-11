import Link from 'next/link';

const features = [
  {
    title: 'AI Valuation Engine',
    description: 'DCF, comps, and dividend discount models with interactive scenario modeling.',
    icon: '📊',
  },
  {
    title: 'Earnings Transcripts',
    description: 'AI-powered summaries with sentiment analysis and searchable key quotes.',
    icon: '📝',
  },
  {
    title: 'Smart Alerts',
    description: 'Get notified when fundamentals shift, not just when prices move.',
    icon: '🔔',
  },
  {
    title: 'Portfolio Risk Analyzer',
    description: 'Evaluate concentration, correlation, and sector exposure in real-time.',
    icon: '🛡️',
  },
  {
    title: 'AI Research Copilot',
    description: 'Chat with an AI that knows every filing, transcript, and data point.',
    icon: '🤖',
  },
  {
    title: 'Price Projections',
    description: 'Monte Carlo simulations with bull, base, and bear probability bands.',
    icon: '📈',
  },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['3 watchlist stocks', 'Basic quotes', '5 AI queries/day', 'Community access'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19.99',
    period: '/month',
    features: [
      'Unlimited watchlist',
      'Full valuation tools',
      '50 AI queries/day',
      'Earnings transcripts',
      'SEC filings browser',
      'Stock comparisons',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '$39.99',
    period: '/month',
    features: [
      'Everything in Pro',
      'Portfolio analyzer',
      'Smart alerts',
      'API access',
      'Priority support',
      'Unlimited AI queries',
    ],
    cta: 'Go Premium',
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                100xMoney
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Docs</a>
              <Link href="/login" className="text-gray-400 hover:text-white transition">Log in</Link>
              <Link
                href="/signup"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="text-emerald-400 text-sm font-medium">Now in Beta</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Stock Research,
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Supercharged by AI
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Real-time valuations, earnings analysis, and smart portfolio tools.
            Everything you need to make confident investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg shadow-emerald-500/25"
            >
              Start Researching Free
            </Link>
            <Link
              href="#features"
              className="border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
            >
              See Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Research Smarter
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful AI tools that give you an unfair advantage in stock analysis.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 text-lg">
              Start free. Upgrade when you are ready.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-8 ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-emerald-500/20 to-gray-800/50 border-2 border-emerald-500/50 scale-105'
                    : 'bg-gray-800/50 border border-gray-700/50'
                }`}
              >
                <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-400">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-300">
                      <span className="text-emerald-400">&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    tier.highlighted
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'border border-gray-600 hover:border-gray-500 text-white'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            100xMoney
          </span>
          <p className="text-gray-500 text-sm">
            &copy; 2026 100xMoney. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
