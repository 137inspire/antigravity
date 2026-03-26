import { notFound } from "next/navigation";
import Image from "next/image";
import { mockProducts } from "@/lib/data";
import AddToCartButton from "@/components/AddToCartButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isWholesale = session?.user?.role === "WHOLESALE" && session?.user?.isVerified;

  const rawProduct = mockProducts.find(p => p.id === id);

  if (!rawProduct) {
    notFound();
  }

  const product = {
    ...rawProduct,
    price: isWholesale ? rawProduct.wholesalePrice : rawProduct.price
  };

  return (
    <div className="container" style={{ padding: "4rem 1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
        
        {/* Product Image */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "12px", overflow: "hidden" }}>
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Product Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h1 style={{ color: "var(--eco-green-dark)", fontSize: "2.5rem", margin: 0 }}>{product.name}</h1>
          <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--eco-green)", margin: 0 }}>
            ${product.price.toFixed(2)}
            {isWholesale && <span style={{fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '1rem'}}>Wholesale Pricing Applied</span>}
          </p>
          
          <div style={{ backgroundColor: "var(--eco-sand)", padding: "1.5rem", borderRadius: "12px" }}>
            <h3 style={{ marginBottom: "0.5rem", color: "var(--eco-earth)", fontSize: "1.2rem", margin: "0 0 0.5rem 0" }}>Description</h3>
            <p style={{ margin: 0 }}>{product.description}</p>
          </div>
          
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Shipping Weight: {product.weight} kg
          </p>

          <AddToCartButton product={product} />

        </div>
      </div>
    </div>
  );
}
