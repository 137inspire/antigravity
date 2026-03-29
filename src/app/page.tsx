import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { isPublished: true },
    take: 4,
    orderBy: { name: 'asc' }
  });

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Sustainable Goods for a Better Tomorrow</h1>
            <p>Shop our curated collection of eco-friendly, zero-waste products. Available for retail and wholesale partners.</p>
            <div className="hero-actions">
              <Link href="/products" className="btn-primary">Shop Now</Link>
              <Link href="/wholesale" className="btn-outline">Wholesale Inquiries</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="product-grid">
            {featuredProducts.map((product) => (
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
                  <p className="price">${product.price.toFixed(2)}</p>
                  <Link href={`/products/${product.id}`} className="btn-outline" style={{width: '100%', marginTop: '1rem'}}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
