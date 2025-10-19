'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartProvider";
import { OrderProvider } from "./OrderProvider";
import { usePathname } from "next/navigation";
import { sendGaEvent } from "@/lib/ga4";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { useCart } from "./CartProvider";
import { useEffect, useState } from "react";

import Link from "next/link";

// trigger page_view every load
function GA4PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    sendGaEvent({
      event_name: 'page_view',
      params: {
        page_location: window.location.href,
        page_title: document.title,
      },
    });
  }, [pathname]);
  return null;
}


function Header() {
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-gray-100 mb-4">
      <Link href="/" className="text-xl font-bold text-blue-700">Demo Shop</Link>
      <Link href="/cart" className="relative text-lg text-green-700">
        Cart
        <span className="ml-2 px-2 py-1 bg-green-600 text-white rounded-full text-xs">{count}</span>
      </Link>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OrderProvider>
          <CartProvider>
            <Header />
            <CookieConsentBanner />
            <GA4PageViewTracker /> {/*new componant*/}
            {children}
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );

function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const consent = document.cookie.match(/(^|;)\s*analytics_consent=([^;]+)/);
    if (!consent) setVisible(true);
  }, []);
  function acceptConsent() {
    document.cookie = `analytics_consent=true; path=/; max-age=31536000`;
    setVisible(false);
  }
  function declineConsent() {
    document.cookie = `analytics_consent=false; path=/; max-age=31536000`;
    setVisible(false);
  }
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay blocks interaction */}
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-auto" style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.25)' }} />
      <div className="relative bg-gray-900 text-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center animate-fade-in" style={{ minWidth: 320 }}>
        <span className="mb-4 text-center">This site uses cookies for analytics. By continuing, you consent.</span>
        <div className="flex gap-4">
          <button className="bg-green-600 px-6 py-2 rounded text-white font-semibold" onClick={acceptConsent}>
            Accept
          </button>
          <button className="bg-gray-600 px-6 py-2 rounded text-white font-semibold" onClick={declineConsent}>
            Decline
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease;
        }
      `}</style>
    </div>
  );
}
}
