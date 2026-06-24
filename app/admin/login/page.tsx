"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const error = searchParams.get("error");
  const errorMsg =
    error === "not-authorized"
      ? "Your account does not have admin access."
      : error
        ? "Login required. Please sign in."
        : null;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  async function handleMagicLink() {
    if (!email || !email.includes("@")) {
      setErrorText("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorText("");

    try {
      const res = await fetch("/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("sent");
      } else {
        setErrorText(data.error ?? "Something went wrong. Please try again.");
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
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#666",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "8px",
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

        {errorMsg && (
          <p
            style={{
              color: "#f87171",
              fontSize: "14px",
              textAlign: "center",
              margin: 0,
              background: "#2a1010",
              border: "1px solid #4a1010",
              borderRadius: "8px",
              padding: "10px 14px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {errorMsg}
          </p>
        )}

        <a
          href={"/auth/sign-in?next=" + encodeURIComponent(next)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            background: "#fff",
            color: "#111",
            fontWeight: 600,
            fontSize: "15px",
            padding: "12px 0",
            borderRadius: "10px",
            textAlign: "center",
            textDecoration: "none",
            boxSizing: "border-box",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Sign in with Google
        </a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#222" }} />
          <span style={{ color: "#555", fontSize: "13px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#222" }} />
        </div>

        {status === "sent" ? (
          <div
            style={{
              background: "#0d2a1a",
              border: "1px solid #14532d",
              borderRadius: "10px",
              padding: "16px",
              width: "100%",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#4ade80", fontSize: "15px", fontWeight: 600, margin: "0 0 6px" }}>
              Check your email ✓
            </p>
            <p style={{ color: "#86efac", fontSize: "13px", margin: 0 }}>
              A login link has been sent to <strong>{email}</strong>. Click the link to access the admin panel.
            </p>
          </div>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
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

            {status === "error" && errorText && (
              <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>
                {errorText}
              </p>
            )}

            <button
              onClick={handleMagicLink}
              disabled={status === "loading"}
              style={{
                width: "100%",
                background: status === "loading" ? "#1a1a2a" : "#1e1b4b",
                border: "1px solid #3730a3",
                color: status === "loading" ? "#666" : "#a5b4fc",
                fontWeight: 600,
                fontSize: "15px",
                padding: "12px 0",
                borderRadius: "10px",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                boxSizing: "border-box",
              }}
            >
              {status === "loading" ? "Sending..." : "Send Magic Link"}
            </button>
          </div>
        )}

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
