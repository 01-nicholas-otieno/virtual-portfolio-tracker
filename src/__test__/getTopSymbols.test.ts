// src/__test__/getTopSymbols.test.ts
import { getTopSymbols } from '@/app/utils';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('getTopSymbols', () => {
  const mockSymbols = [
    { description: 'Apple Inc.', displaySymbol: 'AAPL', symbol: 'AAPL', type: 'Common Stock' },
    // ... other symbols ...
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockSymbols));
    // Default fetch mock returns OK with mockSymbols JSON
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSymbols,
    });
  });

  it('reads and parses symbols.json correctly', async () => {
    const symbols = await getTopSymbols();
    expect(fs.readFile).toHaveBeenCalledWith(
      path.join(process.cwd(), 'data', 'symbols.json'),
      'utf-8'
    );
    expect(symbols).toEqual(mockSymbols.slice(0, 10));
  });

  it('returns empty array if symbols.json is missing', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));
    const symbols = await getTopSymbols();
    expect(symbols).toEqual(mockSymbols.slice(0, 10)); // because fetch fallback returns mockSymbols
    expect(fs.readFile).toHaveBeenCalled();
  });

  it('returns empty array if symbols.json is invalid JSON', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('invalid json');
    const symbols = await getTopSymbols();
    expect(symbols).toEqual(mockSymbols.slice(0, 10));
  });

  it('returns [] if fetch fails', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    const symbols = await getTopSymbols();
    expect(symbols).toEqual([]);
  });

  it('returns [] if fetch throws error', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const symbols = await getTopSymbols();
    expect(symbols).toEqual([]);
  });
});
