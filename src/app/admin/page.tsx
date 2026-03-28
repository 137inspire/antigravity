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

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "80vh" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Admin Dashboard</h1>
        <Link href="/admin/products" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Manage Products</Link>
      </div>
      
      <div style={{ backgroundColor: "var(--surface-color)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--eco-green-dark)" }}>Pending Wholesale Applications</h2>
        
        {pendingWholesale.length === 0 ? (
          <p style={{ color: "var(--eco-earth)" }}>No pending applications at the moment.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                <th style={{ padding: "1rem 0" }}>Business Name</th>
                <th style={{ padding: "1rem 0" }}>Email</th>
                <th style={{ padding: "1rem 0" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingWholesale.map((user: any) => (
                <tr key={user.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem 0", fontWeight: "500" }}>{user.name}</td>
                  <td style={{ padding: "1rem 0", color: "var(--text-muted)" }}>{user.email}</td>
                  <td style={{ padding: "1rem 0" }}>
                    <form action="/api/admin/verify" method="POST">
                      <input type="hidden" name="userId" value={user.id} />
                      <button type="submit" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                        Approve Account
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
