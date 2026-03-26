import Link from "next/link";

export const metadata = {
  title: "Wholesale Partnerships | Eco Store",
};

export default function WholesaleLanding() {
  return (
    <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center", minHeight: "80vh" }}>
      <h1 className="section-title">Wholesale Partnerships</h1>
      <p style={{ fontSize: "1.2rem", color: "var(--eco-earth)", maxWidth: "800px", margin: "0 auto 3rem", lineHeight: "1.8" }}>
        Join our network of eco-conscious retailers. We offer competitive bulk pricing on our sustainable products. 
        All wholesale applications are manually reviewed by our team to ensure alignment with our environmental values.
      </p>

      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
        <Link href="/wholesale/register" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
          Apply for Wholesale Account
        </Link>
        <Link href="/login" className="btn-outline" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
          Retailer Login
        </Link>
      </div>
    </div>
  );
}
