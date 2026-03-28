import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    include: { wholesaleTiers: true },
    orderBy: { name: 'asc' }
  });

  async function addProduct(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const weight = parseFloat(formData.get("weight") as string);
    const image = formData.get("image") as string;

    await prisma.product.create({
      data: { name, description, price, weight, image }
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
  }

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "80vh" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Product Management</h1>
        <Link href="/admin" className="btn-outline">Back to Dashboard</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Product List */}
        <div style={{ backgroundColor: "var(--surface-color)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
          <h2 style={{ marginBottom: "1.5rem", color: "var(--eco-green-dark)" }}>Current Products</h2>
          {products.length === 0 ? (
            <p style={{ color: "var(--eco-earth)" }}>No products added yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                  <th style={{ padding: "1rem 0" }}>Name</th>
                  <th style={{ padding: "1rem 0" }}>Price</th>
                  <th style={{ padding: "1rem 0" }}>Weight</th>
                  <th style={{ padding: "1rem 0" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem 0", fontWeight: "500" }}>{product.name}</td>
                    <td style={{ padding: "1rem 0" }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: "1rem 0" }}>{product.weight} kg</td>
                    <td style={{ padding: "1rem 0" }}>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Product Form */}
        <div style={{ backgroundColor: "var(--surface-color)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", height: 'fit-content' }}>
          <h2 style={{ marginBottom: "1.5rem", color: "var(--eco-green-dark)" }}>Add New Product</h2>
          <form action={addProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Product Name</label>
              <input name="name" required placeholder="e.g. Organic Bamboo Towel" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Price ($)</label>
              <input name="price" type="number" step="0.01" required placeholder="19.99" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Weight (kg)</label>
              <input name="weight" type="number" step="0.1" required placeholder="0.5" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Image URL</label>
              <input name="image" placeholder="https://unsplash.com/..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
              <textarea name="description" rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', resize: 'none' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}
