import path from "path";
import fs from "fs/promises"

interface Symbol {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

interface PortfolioEntry {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice?: number;
}

export async function getTopSymbols(): Promise<Symbol[]> {
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, 'symbols.json');

  try {
    // Try reading from cache
    const data = await fs.readFile(filePath, 'utf-8');
    const symbols: Symbol[] = JSON.parse(data);

    if (symbols && symbols.length > 0) {
      console.log("Using cached symbols");
      return symbols.slice(0, 10);
    }
  } catch {
    console.log("Cached symbols not found or invalid. Fetching from API...");
  }

  // Fallback to API if cache is empty or missing
  try {
    const token = process.env.FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch symbols: ${response.statusText}`);
    }

    const symbols: Symbol[] = await response.json();

    // Ensure directory exists and save the data
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(symbols, null, 2));

    console.log("Fetched symbols from API and saved to disk");
    return symbols.slice(0, 10);
  } catch (error) {
    console.error("Error fetching symbols:", error);
    return [];
  }
}


export async function getPortfolio(): Promise<PortfolioEntry[]> {
  const filePath = path.join(process.cwd(), 'data', 'portfolio.json');

  try {
    // Step 1: Ensure file exists, create if missing
    try {
      await fs.access(filePath);
    } catch (err: unknown) {
      if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn('portfolio.json not found. Creating a new one.');
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, '[]', 'utf-8');
      } else {
        throw err;
      }
    }

    // Step 2: Read file
    const data = await fs.readFile(filePath, 'utf-8');

    // Step 3: Parse JSON
    let portfolio: PortfolioEntry[];
    try {
      portfolio = JSON.parse(data);
    } catch (err) {
      console.error(`${err}:portfolio.json is malformed. Returning empty portfolio.`);
      return [];
    }

    // Step 4: Validate API key
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      throw new Error("FINNHUB_API_KEY environment variable is not set.");
    }

    // Step 5: Fetch current prices
    const portfolioWithPrices = await Promise.all(
      portfolio.map(async (entry) => {
        try {
          const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(entry.symbol)}&token=${apiKey}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const json = await response.json();
          const currentPrice = (typeof json.c === 'number' && json.c > 0)
            ? json.c
            : entry.purchasePrice;

          return { ...entry, currentPrice };
        } catch (error) {
          console.error(`Error fetching price for ${entry.symbol}:`, error);
          return { ...entry, currentPrice: entry.purchasePrice };
        }
      })
    );

    return portfolioWithPrices;

  } catch (error) {
    console.error('Unexpected error in getPortfolio:', error);
    return [];
  }
}
