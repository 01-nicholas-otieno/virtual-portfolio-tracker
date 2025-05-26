'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface Result {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

interface SearchResult {
  count: number;
  result: Result[];
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult['result']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
      const res = await fetch(`https://finnhub.io/api/v1/search?token=${token}&q=${searchQuery}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: SearchResult = await res.json();
      setResults(data.result || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch search results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search stocks, currencies, or cryptos..."
          className="w-full px-4 py-3 pl-10 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {loading && (
        <div className="mt-2 text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      )}

      {error && (
        <div className="mt-2 text-center text-red-500">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((result) => (
            <li key={result.symbol}>
              <Link href={`/stock/${result.symbol}`}>
                <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {result.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {result.displaySymbol} ({result.type})
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {result.symbol}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
