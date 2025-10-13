import Link from 'next/link';

const products = [
  { id: '1123122', name: 'Red T-Shirt', price: 19.99 },
  { id: '2312312', name: 'Blue Jeans', price: 49.99 },
  { id: '3321321', name: 'Sneakers', price: 89.99 },
];

export default function ProductsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ul className="space-y-4">
        {products.map(product => (
          <li key={product.id} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              <span>{product.name} - ${product.price}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link href="/cart" className="text-lg text-green-700 underline">Go to Cart</Link>
      </div>
    </main>
  );
}
