"use client";

import { useCartStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalWeight = items.reduce((sum, item) => sum + (item.product.weight * item.quantity), 0);
  const estimatedShipping = items.length > 0 ? 5 + (totalWeight * 2) : 0;
  const total = subtotal + estimatedShipping;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout failed: ' + data.error);
        setLoading(false);
      }
    } catch(e) {
      alert('Error initiating checkout');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "80vh" }}>
      <h1 className="section-title">Your Cart</h1>
      
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p style={{ fontSize: "1.2rem", color: "var(--eco-earth)", marginBottom: "2rem" }}>
            Your cart is currently empty.
          </p>
          <Link href="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "3rem" }}>
          
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.product.id} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", border: "1px solid var(--border-color)", borderRadius: "8px", marginBottom: "1rem" }}>
                <div style={{ position: "relative", width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden" }}>
                  <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--eco-green-dark)" }}>{item.product.name}</h3>
                  <p style={{ color: "var(--eco-green)", fontWeight: "600", margin: "0 0 1rem 0" }}>${item.product.price.toFixed(2)}</p>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                      style={{ width: "60px", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)", textAlign: "center" }}
                    />
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      style={{ color: "red", textDecoration: "underline", fontSize: "0.9rem", background: "none", border: "none" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary" style={{ backgroundColor: "var(--eco-sand)", padding: "2rem", borderRadius: "12px", height: "fit-content" }}>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--eco-green-dark)", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>Order Summary</h2>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: "600" }}>${subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "var(--text-dark)" }}>
              <span>Shipping ({totalWeight.toFixed(2)}kg)</span>
              <span style={{ fontWeight: "600" }}>${estimatedShipping.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)", fontSize: "1.2rem", fontWeight: "700", color: "var(--eco-green-dark)" }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", marginBottom: "2rem", fontSize: "0.9rem", border: "1px dashed var(--eco-green)" }}>
              <strong>Guest Checkout</strong> is supported. However, creating an account helps you track your orders seamlessly!
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={loading}
              className="btn-primary" 
              style={{ width: "100%", textAlign: "center", fontSize: "1.1rem" }}
            >
              {loading ? "Redirecting to Payment..." : "Proceed to Checkout"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
