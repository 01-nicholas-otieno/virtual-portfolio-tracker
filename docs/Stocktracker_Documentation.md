# Stocktracker Documentation

## Overview
**Stocktracker** is a Next.js application designed to provide users with an interactive platform for exploring stock market data and simulating stock trading. It integrates with the [Finnhub.io API](https://finnhub.io/) to fetch real-time stock data, including search results, stock symbols, and price quotes. The app features a responsive, dark-mode-compatible UI styled with Tailwind CSS, offering functionalities like stock searching, viewing top symbols, and managing a simulated portfolio.

### Purpose
- Enable users to search for stocks, currencies, and cryptocurrencies.
- Display a curated list of top stock symbols.
- Simulate stock buying and track a portfolio with real-time price updates.
- Provide a modern, user-friendly interface for financial data exploration.

### Target Audience
- Individual investors and finance enthusiasts interested in stock market data.
- Developers looking to extend or maintain a financial web application.
- Educators or students exploring stock trading simulations.

## Features
1. **Stock Ticker**:
   - Displays static market data for select assets (e.g., AAPL).
   - Styled as a scrolling marquee for a dynamic feel.
2. **Search Bar**:
   - Real-time search for financial instruments using Finnhub’s `/search` endpoint.
   - Scrollable dropdown with description, symbol, and type.
3. **Top 10 Stock Symbols**:
   - From Finnhub’s `/stock/symbol` endpoint, stored in `data/symbols.json`.
4. **Stock Buying Simulation**:
   - Buy stocks by entering symbol and quantity.
   - Stores purchases in `data/portfolio.json` and averages repeated buys.
5. **Portfolio Display**:
   - Table showing symbol, quantity, purchase price, current price, and total value.
6. **Responsive Design**:
   - Tailwind CSS, dark-mode ready.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Integration**: fetch
- **Data Storage**: Local JSON files
- **Dependencies**: Node.js `fs`, `path`, Font Awesome (optional)
- **Environment**: Node.js 18+
- **Deployment**: Node.js-compatible platforms (e.g., Vercel with caveats)

## Project Structure
```

github_assessment_nicholas_otieno/
├── data/
│   ├── portfolio.json
│   └── symbols.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── buy-stock/
│   │   │   │   └── route.ts
│   │   │   └── fetch-symbols/
│   │   │       └── route.ts
│   │   ├── layout.tsx
|   |   ├── utils.ts
│   │   └── page.tsx
│   └── components/
│       └── SearchBar.tsx
|       ├── BuyStockForm.tsx
|       ├── CompanyProfile.tsx
|       ├── SymbolGrid.tsx
|       └── Ticker.tsx
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── tailwind.config.js

````

## Setup Instructions

### Prerequisites
- Node.js 18+
- Finnhub API Key
- Git
- Code Editor (e.g., VS Code)

### Installation
```bash
git clone https://github.com/Lantel-Dev/github_assessment_nicholas_otieno.git
cd github_assessment_nicholas_otieno
npm install
````

### Configure Environment

Create `.env.local`:

```
FINNHUB_API_KEY=your_api_key_here
NEXT_PUBLIC_FINNHUB_API_KEY=your_api_key_here
```

### Start Development

```bash
npm run dev
```

Visit: `http://localhost:3000`



## Deployment

* For file-write compatible hosts (e.g., VPS, Heroku): works out of the box.
* For Vercel or Netlify:

  * File writes (`fs`) won’t work — switch to DB or S3.
  * Set environment variables via dashboard.

Build:

```bash
npm run build
npm start
```

## Usage

### Homepage Shows:

* Stock ticker (static data)
* Search bar
* Top 10 symbols
* Stock buy form
* Portfolio table

### Symbol Detail Page Shows:

* All Stock details
* Stock buy form
* Portfolio table

### Example Flow:

1. Search for “Apple”.
2. See `AAPL` in dropdown.
3. Click on any stock of interest
4. You are directed to detail page
5. View Stock details
6. Buy 5 shares, or any quantity
7. View in portfolio.
8. Buy more to see average price update.

## Architecture

### Frontend

* **App Router** (`app/` directory)
* **Componts** (`app/components` directory)
* Tailwind CSS for styling

### Backend

* `route.ts` in `/buy-stock/` and `/fetch-symbols/`
* JSON storage: `portfolio.json`, `symbols.json`

### API Integration

* `GET /search?q={query}` – for real-time search
* `GET /stock/symbol?exchange=US` – get symbol list
* `GET /quote?symbol={symbol}` – get current prices

### Type Safety

* TypeScript interfaces for `Symbol` and `PortfolioEntry`

## API Integration

### Endpoints

* **Search**: `/search?q={query}&token=...`
* **Symbols**: `/stock/symbol?exchange=US&token=...`
* **Quote**: `/quote?symbol={symbol}&token=...`

### Rate Limits

* \~60 req/min for free tier
* Use caching, debounce, or upgrade for higher limits

## Limitations

* **Single User**: One portfolio.json
* **Static Ticker**: Not real-time
* **No Budget**: No virtual cash limits
* **Client API Key Exposure**: Use a proxy for production
* **File Writes**: Not suitable for serverless by default

## Future Improvements

* Real-time ticker (WebSocket)
* Multi-user portfolios with DB
* Sell feature
* Cash balance system
* Charts for analytics
* Debounced search
* Accessibility improvements
* Static/mock data for testing
* Auth system

## Maintenance

### Update Symbols

Automate symbols fetching with a cron job or add UI trigger.

### Monitoring

* Track API limits in [Finnhub dashboard](https://finnhub.io/)
* Check JSON file sizes
* Log API route errors

### Troubleshooting

* **Icons missing?**

  ```bash
  npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
  ```
* **Invalid API Key?**

  * Check `.env.local` values.
* **File write fails?**

  * Ensure write access or use database.

## Development Guidelines

* Use Prettier and follow TypeScript + Tailwind best practices.
* Descriptive commits (e.g., "Add stock buying logic").
* Test cross-browser, dark mode.
* PRs to include screenshots (if applicable) and test instructions.

## Contributing

* Fork, create a branch:

  ```bash
  git checkout -b feature/your-feature
  ```
* Submit PR with details
* Prioritize scalability and usability

## License

* Proprietary

## Contact

* **Maintainer**: Dev Team
* **Issues**: Open at Github issues

```

