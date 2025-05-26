interface TickerItemProps {
  symbol: string;
  price: string;
  change: string;
  changeValue: string;
  up?: boolean;
}

const TickerItem = ({ symbol, price, change, changeValue, up = true }: TickerItemProps) => (
  <div className="min-w-max">
    <div className="flex justify-between items-center font-semibold">
      <span>{symbol}</span>
      <span className="ml-2"><strong>{price}</strong></span>
    </div>
    <div className={`flex items-center space-x-1 text-base mt-1 ${up ? 'text-green-500' : 'text-red-500'}`}>
      <i className={`fas ${up ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
      <span>{change}</span>
      <span className="text-xs">({changeValue})</span>
    </div>
  </div>
);

export default function Ticker() {
  const items = [
    { symbol: 'BTC-USD', price: '103866.94', change: '0.08%', changeValue: '80.51', up: true },
    { symbol: 'ETH-USD', price: '2620.77', change: '2.82%', changeValue: '71.93', up: true },
    { symbol: 'EUR/USD', price: '1.1194', change: '0.07%', changeValue: '0.00074', up: true },
    { symbol: 'GBP/USD', price: '1.3287', change: '-0.14%', changeValue: '-0', up: false },
    { symbol: 'AAPL', price: '211.56', change: '-0.36%', changeValue: '-1', up: false },
    { symbol: 'MSFT', price: '453', change: '0.01%', changeValue: '0.060', up: true },
    { symbol: 'AMZN', price: '205.85', change: '-2.09%', changeValue: '-4.40', up: false },
  ];

  return (
    <section className="bg-black text-white py-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
      <div className="container mx-auto px-4">
        <div className="flex space-x-6 text-sm">
          {items.map((item, index) => (
            <TickerItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
