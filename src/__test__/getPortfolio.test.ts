import fs from 'fs/promises';
import path from 'path';
import { getPortfolio } from '@/app/utils';

jest.mock('fs/promises');

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('getPortfolio', () => {
  const mockPortfolio = [
    { symbol: 'AAPL', shares: 10, purchasePrice: 150 },
    { symbol: 'MSFT', shares: 5, purchasePrice: 200 },
  ];

  const portfolioPath = path.join(process.cwd(), 'data', 'portfolio.json');

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockPortfolio));
  });

  it('returns portfolio with live prices when API succeeds', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockImplementation((url: string) => {
      const symbol = url.includes('AAPL') ? 'AAPL' : 'MSFT';
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ c: symbol === 'AAPL' ? 170 : 210 }),
      });
    });

    const result = await getPortfolio();
    expect(fs.readFile).toHaveBeenCalledWith(portfolioPath, 'utf-8');
    expect(result).toEqual([
      { symbol: 'AAPL', shares: 10, purchasePrice: 150, currentPrice: 170 },
      { symbol: 'MSFT', shares: 5, purchasePrice: 200, currentPrice: 210 },
    ]);
  });

  it('falls back to purchase price if fetch returns non-200', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const result = await getPortfolio();
    expect(result).toEqual([
      { symbol: 'AAPL', shares: 10, purchasePrice: 150, currentPrice: 150 },
      { symbol: 'MSFT', shares: 5, purchasePrice: 200, currentPrice: 200 },
    ]);
  });

  it('falls back to purchase price if fetch throws error', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockRejectedValue(new Error('Network error'));

    const result = await getPortfolio();
    expect(result).toEqual([
      { symbol: 'AAPL', shares: 10, purchasePrice: 150, currentPrice: 150 },
      { symbol: 'MSFT', shares: 5, purchasePrice: 200, currentPrice: 200 },
    ]);
  });

  it('returns [] if portfolio file not found', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

    const result = await getPortfolio();
    expect(result).toEqual([]);
  });

  it('returns [] if portfolio file is invalid JSON', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('not a json');

    const result = await getPortfolio();
    expect(result).toEqual([]);
  });
});
