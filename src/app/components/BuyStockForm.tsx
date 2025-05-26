'use client';

import { useState } from 'react';

export default function BuyStockForm({ symbol }: { symbol: string }) {
  const [quantity, setQuantity] = useState<string>(''); // string, not number

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    try {
      const response = await fetch('/api/buy-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, quantity: qty }),
      });

      if (response.ok) {
        alert('Stock purchased successfully!');
        window.location.reload();
      } else {
        const { error } = await response.json();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      alert(`Error: Failed to process purchase, ${error}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-lg"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="quantity"
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g., 10"
          className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Buy Stock
      </button>
    </form>
  );
}
