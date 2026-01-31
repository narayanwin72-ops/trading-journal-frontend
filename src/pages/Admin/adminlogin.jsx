import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (email === "admin@admin.com" && password === "admin123") {
      // ✅ LOGIN FLAG + LOGIN TIME (for 12 hour expiry)
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_login_time", Date.now().toString());

      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials");
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        {/* HEADER */}
        <div style={header}>
          <h2 style={title}>Trading Journal</h2>
          <p style={subtitle}>Admin Access</p>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        {/* FORM */}
        <form onSubmit={handleLogin} style={form}>
          <div style={field}>
            <label style={label}>Admin Email</label>
            <input
              type="email"
              placeholder="admin@admin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={input}
            />
          </div>

          <div style={field}>
            <label style={label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={input}
            />
          </div>

          <button type="submit" style={button}>
            Login to Admin Panel
          </button>
        </form>

        {/* FOOTER */}
        <div style={footer}>
          <span style={footerText}>
            Secure • Analytics • Discipline
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(180deg, #eef2f7, #f8fafc)",
};

const card = {
  width: "400px",
  background: "#ffffff",
  borderRadius: "12px",
  padding: "34px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
};

const header = {
  textAlign: "center",
  marginBottom: "26px",
};

const title = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "700",
  color: "#0f172a",
  letterSpacing: "0.3px",
};

const subtitle = {
  marginTop: "6px",
  fontSize: "13px",
  color: "#475569",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const label = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#334155",
};

const input = {
  padding: "11px 12px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  outline: "none",
};

const button = {
  marginTop: "10px",
  padding: "12px",
  fontSize: "14px",
  fontWeight: "600",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  fontSize: "13px",
  padding: "9px 12px",
  borderRadius: "6px",
  marginBottom: "16px",
  textAlign: "center",
};

const footer = {
  marginTop: "26px",
  textAlign: "center",
};

const footerText = {
  fontSize: "11px",
  color: "#64748b",
};
