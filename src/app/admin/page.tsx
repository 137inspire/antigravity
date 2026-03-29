import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const pendingWholesale = await prisma.user.findMany({
    where: { role: "WHOLESALE", isVerified: false },
    orderBy: { email: 'asc' }
  });

  const productCount = await prisma.product.count();
  const publishedCount = await prisma.product.count({ where: { isPublished: true } });
  const usersCount = await prisma.user.count();
  const wholesaleCount = await prisma.user.count({ where: { role: "WHOLESALE" } });

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "80vh" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Manage your products, users, and orders</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/products" className="btn-primary">Manage Products</Link>
          <button className="btn-outline" style={{ opacity: 0.5, cursor: 'not-allowed' }}>View Logs</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Products</p>
          <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem' }}>{productCount}</h3>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--eco-green)' }}>{publishedCount} live in store</p>
        </div>
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Users</p>
          <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem' }}>{usersCount}</h3>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--eco-earth)' }}>{wholesaleCount} Wholesale Partners</p>
        </div>
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pending Apps</p>
          <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', color: pendingWholesale.length > 0 ? 'var(--eco-earth)' : 'var(--eco-green)' }}>{pendingWholesale.length}</h3>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requires Verification</p>
        </div>
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Platform Status</p>
          <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', color: 'var(--eco-green)' }}>Active</h3>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Prisma client connected</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: "var(--surface-color)", padding: "2.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ marginBottom: "1.5rem", color: "var(--eco-green-dark)", fontSize: '1.4rem' }}>Wholesale Verification</h2>
          
          {pendingWholesale.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: "var(--text-muted)" }}>
              <p>All clear! No pending applications.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <th style={{ padding: "1rem 0" }}>Partner</th>
                    <th style={{ padding: "1rem 0" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingWholesale.map((user: any) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1.2rem 0" }}>
                        <div style={{ fontWeight: "600" }}>{user.name || "Unknown Business"}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      </td>
                      <td style={{ padding: "1.2rem 0" }}>
                        <form action="/api/admin/verify" method="POST">
                          <input type="hidden" name="userId" value={user.id} />
                          <button type="submit" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: '6px' }}>
                            Approve
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: "var(--surface-color)", padding: "2.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ marginBottom: "1.5rem", color: "var(--eco-green-dark)", fontSize: '1.4rem' }}>Database Quick Tools</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/admin/products" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s ease' }} className="admin-tool-link">
              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>Product Catalog</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Manage stock, prices, and visibility</span>
              </div>
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>→</span>
            </Link>
            <Link href="/admin/users" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s ease' }} className="admin-tool-link">
              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>User Management</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Verify wholesale partners and manage roles</span>
              </div>
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>→</span>
            </Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', opacity: 0.6 }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>Order History</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Monitor sales and fulfillments (Coming Soon)</span>
              </div>
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>🔒</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', opacity: 0.6 }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>Site Settings</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Configure platform-wide defaults</span>
              </div>
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>⚙️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
