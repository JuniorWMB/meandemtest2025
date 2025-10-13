"use client";
import Link from 'next/link';

const products = [
  { id: '1', name: 'Red T-Shirt', price: 19.99 },
  { id: '2', name: 'Blue Jeans', price: 49.99 },
  { id: '3', name: 'Sneakers', price: 89.99 },
];

import { useCart } from './CartProvider';
import { useState } from 'react';

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleQuickAdd(product: typeof products[0]) {
    setLoadingId(product.id);
    await new Promise(res => setTimeout(res, 600 + Math.random() * 600));
    addToCart(product);
    setLoadingId(null);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border p-6 rounded flex flex-col items-center justify-between bg-white">
            <span className="mb-2 text-lg font-semibold">{product.name}</span>
            <span className="mb-4 text-gray-700">${product.price}</span>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              disabled={loadingId === product.id}
              onClick={() => handleQuickAdd(product)}
            >
              {loadingId === product.id ? 'Adding...' : 'Quick Add'}
            </button>
          </div>
        ))}
            </div>
    </main>
  );
}
