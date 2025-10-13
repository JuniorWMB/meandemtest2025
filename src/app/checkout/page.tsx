"use client";
import { useCart } from '../CartProvider';
import { useState } from 'react';
import Link from 'next/link';
import { useOrder } from "../OrderProvider";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState({
    line1: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  });
  const [card, setCard] = useState('');
  const { clearCart } = useCart();
  const { setLastOrder } = useOrder();
  const router = useRouter();

  // Only allow numbers in credit card field
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCard(value);
  };

  const handleAddressChange = (field: keyof typeof address) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = 'order_' + Math.random().toString(36).substring(2, 10).toUpperCase();
    // Simulate backend event
    setLastOrder({ order_id: orderId, email, address, card: card.slice(-4) });
    clearCart();
    // Client-side navigation to confirmation page
    router.push("/confirmation");
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleCheckout} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Email Address</h2>
          <div className="mb-2">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border p-2 rounded w-full mb-2"
              autoComplete="email"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <input
              type="text"
              required
              placeholder="Full name"
              className="border p-2 rounded w-full"
              autoComplete="name"
              value={address.line1}
              onChange={handleAddressChange('line1')}
            />
            <input
              type="text"
              required
              placeholder="Street address"
              className="border p-2 rounded w-full"
              autoComplete="street-address"
              value={address.street}
              onChange={handleAddressChange('street')}
            />
            <input
              type="text"
              required
              placeholder="City"
              className="border p-2 rounded w-full"
              autoComplete="address-level2"
              value={address.city}
              onChange={handleAddressChange('city')}
            />
            <input
              type="text"
              required
              placeholder="State/Province"
              className="border p-2 rounded w-full"
              autoComplete="address-level1"
              value={address.state}
              onChange={handleAddressChange('state')}
            />
            <input
              type="text"
              required
              placeholder="Postal code"
              className="border p-2 rounded w-full"
              autoComplete="postal-code"
              value={address.postcode}
              onChange={handleAddressChange('postcode')}
            />
            <input
              type="text"
              required
              placeholder="Country"
              className="border p-2 rounded w-full"
              autoComplete="country"
              value={address.country}
              onChange={handleAddressChange('country')}
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Card number</h2>
          <input
            type="text"
            required
            placeholder="Credit card number"
            value={card}
            onChange={handleCardChange}
            className="border p-2 rounded w-full"
            maxLength={16}
            autoComplete="cc-number"
            inputMode="numeric"
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Complete Order</button>
      </form>
      <div className="mt-8">
        <Link href="/" className="text-blue-600 underline">Back to Products</Link>
      </div>
    </main>
  );
}
