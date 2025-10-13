"use client";
import Link from "next/link";
import { useOrder } from "../OrderProvider";

export default function ConfirmationPage() {
  const { lastOrder } = useOrder();
  if (!lastOrder) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">No order found.</h2>
        </div>
        <Link href="/" className="text-blue-600 underline">Back to Products</Link>
      </main>
    );
  }
  const { order_id, email, address, card } = lastOrder;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Thank you for your order!</h2>
        <div className="mb-4">
          <strong>Order ID:</strong> {order_id}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {email}
        </div>
        <div className="mb-4">
          <strong>Shipping Address:</strong><br />
          {address.line1}<br />
          {address.street}<br />
          {address.city}, {address.state}<br />
          {address.postcode}<br />
          {address.country}
        </div>
        <div className="mb-4">
          <strong>Card (last 4 digits):</strong> {card.slice(-4)}
        </div>
      </div>
      <Link href="/" className="text-blue-600 underline">Back to Products</Link>
    </main>
  );
}
