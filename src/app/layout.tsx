import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import CartIcon from "@/components/CartIcon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Eco Bitex | Sustainable Wholesale & Retail",
  description: "Your go-to eco-friendly shop for organic and sustainable products.",
};

import Image from "next/image";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Image src="/logo.png" alt="Eco Bitex Logo" width={40} height={40} style={{ borderRadius: '50%' }} />
                Eco Bitex
              </Link>
              <div className="nav-links">
                <Link href="/products" className="nav-link">Shop</Link>
                <Link href="/wholesale" className="nav-link">Wholesale</Link>
                {session?.user?.role === "ADMIN" && (
                  <Link href="/admin" className="nav-link" style={{ color: "var(--eco-earth)", fontWeight: "bold" }}>Admin</Link>
                )}
                <CartIcon />
                {session ? (
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.9rem", color: "var(--eco-green-dark)" }}>Hi, {session.user.name || "User"}</span>
                    <Link href="/api/auth/signout" className="btn-outline" style={{ padding: '0.4rem 1rem' }}>Log Out</Link>
                  </div>
                ) : (
                  <Link href="/login" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign In</Link>
                )}
              </div>
            </div>
          </nav>
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
