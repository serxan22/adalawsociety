"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const router = useRouter();

  const error = searchParams.get("error");
  const urlError =
    error === "not-authorized"
      ? "Your account does not have admin access."
      : error === "login-required"
        ? "Please sign in to continue."
        : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setErrorText("Please enter both email and password.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorText("");

    try {
      const res = await fetch("/auth/email-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, next }),
      });
      const data = await res.json();

      if (data.success) {
        router.push(next);
        router.refresh();
      } else {
        setErrorText(data.error ?? "Invalid email or password.");
        setStatus("error");
      }
    } catch {
      setErrorText("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "#111118",
          border: "1px solid #222",
          borderRadius: "16px",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          width: "100%",
          maxWidth: "380px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#666",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            ADA Law Society
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Admin Panel
          </h1>
        </div>

        {urlError && (
          <p
            style={{
              color: "#f87171",
              fontSize: "14px",
              textAlign: "center",
              background: "#2a1010",
              border: "1px solid #4a1010",
              borderRadius: "8px",
              padding: "10px 14px",
              width: "100%",
              boxSizing: "border-box",
              margin: 0,
            }}
          >
            {urlError}
          </p>
        )}

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "#888", fontSize: "13px" }}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                background: "#0d0d14",
                border: "1px solid #2a2a3a",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "#888", fontSize: "13px" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                background: "#0d0d14",
                border: "1px solid #2a2a3a",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {status === "error" && errorText && (
            <p
              style={{
                color: "#f87171",
                fontSize: "13px",
                margin: 0,
                background: "#2a1010",
                border: "1px solid #4a1010",
                borderRadius: "8px",
                padding: "10px 14px",
              }}
            >
              {errorText}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={status === "loading"}
            style={{
              width: "100%",
              background: status === "loading" ? "#1a1a2a" : "#1e1b4b",
              border: "1px solid #3730a3",
              color: status === "loading" ? "#666" : "#a5b4fc",
              fontWeight: 600,
              fontSize: "15px",
              padding: "13px 0",
              borderRadius: "10px",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              boxSizing: "border-box",
            }}
          >
            {status === "loading" ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p style={{ color: "#444", fontSize: "12px", textAlign: "center", margin: 0 }}>
          Only authorized ALS admins can access this panel.
        </p>
      </div>
    </main>
  );
}

function LoginFallback() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    />
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginContent />
    </Suspense>
  );
}
