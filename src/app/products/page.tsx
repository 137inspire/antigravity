import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Shop All Products | Eco Bitex",
};

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const isWholesale = session?.user?.role === "WHOLESALE" && session?.user?.isVerified;

  const products = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="container" style={{ padding: "4rem 1.5rem" }}>
      <h1 className="section-title">All Products</h1>
      <p style={{ textAlign: "center", marginBottom: "3rem", color: "var(--eco-earth)" }}>
        Explore our wide range of eco-friendly solutions for your everyday needs.
      </p>
      
      <div className="product-grid">
        {products.map((product) => {
          // Fallback to base price if no wholesale tier is found
          const displayPrice = isWholesale ? (product as any).wholesalePrice ?? product.price : product.price;

          return (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <Image 
                  src={product.image || '/logo.png'} 
                  alt={product.name} 
                  fill 
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">
                  ${displayPrice.toFixed(2)}
                  {isWholesale && <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem'}}>(Wholesale)</span>}
                </p>
                <Link href={`/products/${product.id}`} className="btn-outline" style={{width: '100%', marginTop: '1rem'}}>
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
