import BuyStockForm from '@/app/components/BuyStockForm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPortfolio } from '@/app/utils';


const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;


export default async function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const portfolio = await getPortfolio();
  if (!symbol) return notFound();

  const [quoteRes, profileRes] = await Promise.all([
    fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`),
    fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${token}`),
  ]);

  if (!quoteRes.ok || !profileRes.ok) return notFound();

  const quote = await quoteRes.json();
  const profile = await profileRes.json();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center space-x-4 mb-6">
        {profile.logo && (
          <Image width={100} height={100} src={profile.logo} alt={profile.name} className="w-16 h-16 rounded-full" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-500">{profile.ticker} — {profile.exchange}</p>
          <a href={profile.weburl} className="text-blue-500 text-sm" target="_blank" rel="noopener noreferrer">
            Visit Website
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div>
          <p className="text-gray-500 text-sm">Current Price</p>
          <p className="text-lg font-semibold">${quote.c}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Change</p>
          <p className={`text-lg font-semibold ${quote.d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
  {quote?.d ?? 'N/A'} ({quote?.dp != null ? quote.dp.toFixed(2) : '0.00'}%)
</p>

        </div>
        <div>
          <p className="text-gray-500 text-sm">High</p>
          <p className="text-lg">${quote.h}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Low</p>
          <p className="text-lg">${quote.l}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Open</p>
          <p className="text-lg">${quote.o}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Previous Close</p>
          <p className="text-lg">${quote.pc}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Industry</p>
          <p className="text-lg">{profile.finnhubIndustry}</p>
        </div>
        <div>
          <p className="text-lg">
  {profile?.marketCapitalization != null
    ? `$${profile.marketCapitalization.toLocaleString()}B`
    : 'N/A'}
</p>
        </div>
      </div>


      <section className="w-full max-w-lg mx-auto">
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Buy Stocks
          </h2>
          <BuyStockForm symbol={symbol}/>
      </section>

      {portfolio.length > 0 && (
  <section className="w-full max-w-lg mx-auto">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Your Portfolio
    </h2>
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-900 dark:text-gray-100">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Purchase Price</th>
            <th className="px-4 py-3">Current Price</th>
            <th className="px-4 py-3">Total Value</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((entry) => (
            <tr
              key={entry.symbol}
              className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-3">{entry.symbol}</td>
              <td className="px-4 py-3">{entry.quantity}</td>
              <td className="px-4 py-3">${entry.purchasePrice.toFixed(2)}</td>
              <td className="px-4 py-3">${entry.currentPrice?.toFixed(2) || 'N/A'}</td>
              <td className="px-4 py-3">
                ${(entry.currentPrice! * entry.quantity).toFixed(2) || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>

        {/* Add this footer */}
        <tfoot>
          <tr className="bg-gray-100 dark:bg-gray-700 font-semibold">
            <td className="px-4 py-3 text-right" colSpan={4}>
              Total Value:
            </td>
            <td className="px-4 py-3">
              ${portfolio
                .reduce(
                  (acc, entry) => acc + (entry.currentPrice ? entry.currentPrice * entry.quantity : 0),
                  0
                )
                .toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
)}

    </div>
  );
}
