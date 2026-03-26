"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WholesaleRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "WHOLESALE" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to register");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center", minHeight: "80vh" }}>
        <h1 className="section-title">Application Received</h1>
        <p style={{ fontSize: "1.2rem", color: "var(--eco-earth)", maxWidth: "600px", margin: "0 auto" }}>
          Thank you for applying! Our admin team will review your application shortly. Once verified, you will be able to log in and access bulk pricing.
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", maxWidth: "500px", minHeight: "80vh" }}>
      <h1 className="section-title">Wholesale Application</h1>
      
      {error && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "var(--eco-green-dark)" }}>Business Name</label>
          <input required type="text" name="name" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "1rem" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "var(--eco-green-dark)" }}>Business Email</label>
          <input required type="email" name="email" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "1rem" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "var(--eco-green-dark)" }}>Password</label>
          <input required type="password" name="password" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "1rem" }} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
