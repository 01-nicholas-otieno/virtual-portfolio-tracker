import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getTopSymbols } from '@/app/utils';


export async function GET() {
  try {
    const existingSymbols = await getTopSymbols();

    // If data exists and has .stock type entries, skip fetching
    if (existingSymbols.length > 0) {
      console.log('Symbols already present, skipping fetch.');
      return NextResponse.json({
        message: 'Symbols already loaded',
        count: existingSymbols.length,
        fromCache: true,
      });
    }

    const token = process.env.FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${token}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch symbols: ${response.statusText}`);
    }

    const symbols = await response.json();

    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });

    const filePath = path.join(dataDir, 'symbols.json');
    await fs.writeFile(filePath, JSON.stringify(symbols, null, 2));

    return NextResponse.json({
      message: 'Symbols fetched and saved successfully',
      count: symbols.length,
      fromCache: false,
    });
  } catch (error) {
    console.error('Error fetching symbols:', error);
    return NextResponse.json(
      { error: 'Failed to fetch or save symbols' },
      { status: 500 }
    );
  }
}
