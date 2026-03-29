import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' }
  });

  async function toggleWholesaleStatus(userId: string, currentStatus: boolean) {
    "use server";
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: !currentStatus, role: "WHOLESALE" }
    });
    revalidatePath("/admin/users");
    revalidatePath("/admin");
  }

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "80vh" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="section-title" style={{ margin: 0, textAlign: 'left' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Manage roles and verifications</p>
        </div>
        <Link href="/admin" className="btn-outline">Back to Dashboard</Link>
      </div>

      <div style={{ backgroundColor: "var(--surface-color)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: 'var(--shadow-md)' }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border-color)", color: 'var(--text-muted)' }}>
              <th style={{ padding: "1rem 1rem 1rem 0" }}>Name</th>
              <th style={{ padding: "1rem" }}>Email</th>
              <th style={{ padding: "1rem" }}>Role</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "1.2rem 1.2rem 1.2rem 0", fontWeight: "600" }}>{user.name || "N/A"}</td>
                <td style={{ padding: "1.2rem", color: "var(--text-muted)" }}>{user.email}</td>
                <td style={{ padding: "1.2rem" }}>
                  <span style={{ 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    backgroundColor: user.role === 'ADMIN' ? 'var(--eco-earth)' : (user.role === 'WHOLESALE' ? 'var(--eco-green)' : 'var(--eco-sand)') ,
                    color: user.role === 'RETAIL' ? 'var(--text-dark)' : 'white'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: "1.2rem" }}>
                  {user.role === 'WHOLESALE' ? (
                    <span style={{ color: user.isVerified ? 'var(--eco-green)' : 'var(--eco-earth)', fontWeight: '500' }}>
                      {user.isVerified ? '✓ Verified' : '⚠ Pending'}
                    </span>
                  ) : '-'}
                </td>
                <td style={{ padding: "1.2rem", textAlign: 'right' }}>
                  {user.role === 'WHOLESALE' && (
                    <form action={async () => {
                      "use server";
                      await toggleWholesaleStatus(user.id, user.isVerified);
                    }}>
                      <button type="submit" className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                        {user.isVerified ? 'Deactivate' : 'Verify'}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
