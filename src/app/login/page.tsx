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

      <div style={{ margin: "2rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>OR</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
      </div>

      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="btn-secondary"
        style={{
          width: "100%",
          padding: "0.85rem",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          fontSize: "1rem",
          fontWeight: "600",
          backgroundColor: "#24292e",
          color: "white",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1a1e22")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#24292e")}
      >
        <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        Continue with GitHub
      </button>
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
