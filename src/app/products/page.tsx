import Link from "next/link";
import Image from "next/image";
import { mockProducts } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Shop All Products | Eco Store",
};

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const isWholesale = session?.user?.role === "WHOLESALE" && session?.user?.isVerified;

  return (
    <div className="container" style={{ padding: "4rem 1.5rem" }}>
      <h1 className="section-title">All Products</h1>
      <p style={{ textAlign: "center", marginBottom: "3rem", color: "var(--eco-earth)" }}>
        Explore our wide range of eco-friendly solutions for your everyday needs.
      </p>
      
      <div className="product-grid">
        {mockProducts.map((product) => {
          const displayPrice = isWholesale ? product.wholesalePrice : product.price;

          return (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <Image 
                  src={product.image} 
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
