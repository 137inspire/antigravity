"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" className="nav-link">
      Cart ({mounted ? itemCount : 0})
    </Link>
  );
}
