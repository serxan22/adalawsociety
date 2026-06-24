type LoginSearchParams = {
  error?: string;
  next?: string;
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<LoginSearchParams>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/admin";
  const errorMsg =
    params.error === "not-authorized"
      ? "Your account does not have admin access."
      : params.error
        ? "Login required. Please sign in."
        : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
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
          gap: "24px",
          width: "100%",
          maxWidth: "360px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#888",
              fontSize: "13px",
              marginBottom: "8px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            ADA Law Society
          </p>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 600, margin: 0 }}>
            Admin Panel
          </h1>
        </div>

        {errorMsg && (
          <p style={{ color: "#f87171", fontSize: "14px", textAlign: "center", margin: 0 }}>
            {errorMsg}
          </p>
        )}

        <a
          href={"/auth/sign-in?next=" + encodeURIComponent(next)}
          style={{
            display: "block",
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
          Sign in with Google
        </a>

        <p style={{ color: "#555", fontSize: "12px", textAlign: "center", margin: 0 }}>
          Only authorized ALS admins can access this panel.
        </p>
      </div>
    </main>
  );
}
