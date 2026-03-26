export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  wholesalePrice: number;
  weight: number;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Bamboo Toothbrush Set",
    description: "100% biodegradable bamboo toothbrushes with charcoal bristles. Pack of 4.",
    image: "https://images.unsplash.com/photo-1620211135759-543594ea1c8c?auto=format&fit=crop&q=80&w=600",
    price: 12.00,
    wholesalePrice: 8.00,
    weight: 0.1,
  },
  {
    id: "2",
    name: "Reusable Produce Bags",
    description: "Organic cotton mesh bags. Perfect for zero waste grocery shopping.",
    image: "https://images.unsplash.com/photo-1587841571217-06df8b0561e1?auto=format&fit=crop&q=80&w=600",
    price: 18.50,
    wholesalePrice: 12.00,
    weight: 0.2,
  },
  {
    id: "3",
    name: "Natural Deodorant Balm",
    description: "Aluminum-free, vegan deodorant in plastic-free tin packaging. Lavender and Sage scent.",
    image: "https://images.unsplash.com/photo-1610427382218-1d2fde5fc1c6?auto=format&fit=crop&q=80&w=600",
    price: 14.00,
    wholesalePrice: 9.00,
    weight: 0.15,
  },
  {
    id: "4",
    name: "Beeswax Wrap Set",
    description: "Sustainable alternative to plastic wrap. 3 assorted sizes for bowls to sandwiches.",
    image: "https://images.unsplash.com/photo-1590747065999-56ad0fb3bd9c?auto=format&fit=crop&q=80&w=600",
    price: 22.00,
    wholesalePrice: 15.00,
    weight: 0.1,
  }
];
