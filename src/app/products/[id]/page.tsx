import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isWholesale = session?.user?.role === "WHOLESALE" && session?.user?.isVerified;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { wholesaleTiers: { orderBy: { minQuantity: 'asc' } } }
  });

  if (!product || (!product.isPublished && session?.user?.role !== "ADMIN")) {
    notFound();
  }

  // Determine display price
  let displayPrice = product.price;
  if (isWholesale && product.wholesaleTiers.length > 0) {
    displayPrice = product.wholesaleTiers[0].price;
  }

  const productForCart = {
    id: product.id,
    name: product.name,
    description: product.description || "",
    image: product.image || "/logo.png",
    price: displayPrice,
    wholesalePrice: displayPrice, // Default to displayPrice for cart type compatibility
    weight: product.weight
  };

  return (
    <div className="container" style={{ padding: "4rem 1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
        
        {/* Product Image */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "12px", overflow: "hidden" }}>
          <Image 
            src={product.image || "/logo.png"} 
            alt={product.name} 
            fill 
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Product Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h1 style={{ color: "var(--eco-green-dark)", fontSize: "2.5rem", margin: 0 }}>{product.name}</h1>
          <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--eco-green)", margin: 0 }}>
            ${displayPrice.toFixed(2)}
            {isWholesale && <span style={{fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '1rem'}}>Wholesale Pricing Applied</span>}
          </p>
          
          <div style={{ backgroundColor: "var(--eco-sand)", padding: "1.5rem", borderRadius: "12px" }}>
            <h3 style={{ marginBottom: "0.5rem", color: "var(--eco-earth)", fontSize: "1.2rem", margin: "0 0 0.5rem 0" }}>Description</h3>
            <p style={{ margin: 0 }}>{product.description}</p>
          </div>
          
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Shipping Weight: {product.weight} kg
          </p>

          <AddToCartButton product={productForCart} />

        </div>
      </div>
    </div> 
  );
}
