import Link from "next/link";

interface Symbol {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export default function SymbolGrid({ symbols }: { symbols: Symbol[] }) {
  if (!symbols.length) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Top 10 Stock Symbols
      </h2>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4">
        <div className="flex flex-wrap gap-4">
          {symbols.map((symbol) => (
            <Link
              key={symbol.symbol}
              href={`/stock/${symbol.symbol}`}
              className="w-full sm:w-[48%] md:w-[30%] lg:w-[22%] xl:w-[18%] px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors block"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {symbol.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {symbol.displaySymbol} ({symbol.type})
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                {symbol.symbol}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
