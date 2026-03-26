"use client";

import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/data";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  return (
    <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
      <input 
        type="number" 
        value={quantity} 
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
        min={1} 
        style={{
          width: "80px", 
          padding: "0.75rem", 
          borderRadius: "6px", 
          border: "1px solid var(--border-color)",
          textAlign: "center",
          fontSize: "1rem"
        }}
      />
      <button 
        onClick={() => {
          addItem(product, quantity);
          alert("Added to cart!");
        }} 
        className="btn-primary" 
        style={{ flexGrow: 1 }}
      >
        Add to Cart
      </button>
    </div>
  );
}
