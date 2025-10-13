"use client";
import Link from 'next/link';
import { useCart } from '../CartProvider';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="mb-4">Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-4">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between items-center border-b py-2">
                <span>{item.name} x {item.quantity} (${item.price} each)</span>
                <button
                  className="text-red-600 underline ml-4"
                  onClick={() => removeFromCart(item.id)}
                >Remove</button>
              </li>
            ))}
          </ul>
          <div className="mb-4 font-bold">Total: ${total.toFixed(2)}</div>
          <button className="bg-gray-300 px-3 py-1 rounded mr-4" onClick={clearCart}>Clear Cart</button>
        </>
      )}
      <Link href="/checkout" className="bg-green-600 text-white px-4 py-2 rounded">Proceed to Checkout</Link>
      <div className="mt-8">
        <Link href="/" className="text-blue-600 underline">Back to Products</Link>
      </div>
    </main>
  );
}
