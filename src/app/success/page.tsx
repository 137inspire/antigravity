"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/lib/store";

export default function SuccessPage() {
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container" style={{ padding: "6rem 1.5rem", textAlign: "center", minHeight: "80vh" }}>
      <div style={{ backgroundColor: "var(--eco-green-light)", borderRadius: "50%", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
        <span style={{ fontSize: "3rem" }}>🌿</span>
      </div>
      <h1 className="section-title">Thank You for Your Order!</h1>
      <p style={{ fontSize: "1.2rem", color: "var(--eco-earth)", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto 3rem" }}>
        Your payment was successful and your eco-friendly products are being prepared for shipping.
      </p>
      
      <Link href="/products" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}
