import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface BuyStockRequest {
  symbol: string;
  quantity: number;
}

export interface PortfolioEntry {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

export async function POST(request: Request) {
  try {
    const { symbol, quantity }: BuyStockRequest = await request.json();

    if (!symbol || quantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid symbol or quantity' },
        { status: 400 }
      );
    }

    // Fetch current price from Finnhub using fetch instead of axios
    //already fetched /quota data
    const currentPrice = 23; //substitute with

    if (!currentPrice || currentPrice <= 0) {
      return NextResponse.json(
        { error: 'Invalid stock symbol or price data unavailable' },
        { status: 400 }
      );
    }

    // Read or initialize portfolio
    const filePath = path.join(process.cwd(), 'data', 'portfolio.json');
    let portfolio: PortfolioEntry[] = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      portfolio = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is empty; initialize empty portfolio
      console.log(error)
    }

    // Add or update stock in portfolio
    const existingEntry = portfolio.find((entry) => entry.symbol === symbol.toUpperCase());
    if (existingEntry) {
      const totalQuantity = existingEntry.quantity + quantity;
      const totalCost =
        existingEntry.purchasePrice * existingEntry.quantity + currentPrice * quantity;
      existingEntry.purchasePrice = totalCost / totalQuantity;
      existingEntry.quantity = totalQuantity;
      existingEntry.purchaseDate = new Date().toISOString();
    } else {
      portfolio.push({
        symbol: symbol.toUpperCase(),
        quantity,
        purchasePrice: currentPrice,
        purchaseDate: new Date().toISOString(),
      });
    }

    // Save updated portfolio
    await fs.writeFile(filePath, JSON.stringify(portfolio, null, 2));

    return NextResponse.json({
      message: 'Stock purchased successfully',
      symbol,
      quantity,
      purchasePrice: currentPrice,
    });
  } catch (error) {
    console.error('Error buying stock:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
