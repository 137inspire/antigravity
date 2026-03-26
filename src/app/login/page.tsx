"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. If you are a wholesale partner, you must be verified by admin first.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", maxWidth: "400px", minHeight: "80vh" }}>
      <h1 className="section-title" style={{ marginBottom: "2rem" }}>Sign In</h1>
      
      {error && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "var(--eco-green-dark)" }}>Email Address</label>
          <input required type="email" name="email" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "1rem" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "var(--eco-green-dark)" }}>Password</label>
          <input required type="password" name="password" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "1rem" }} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
