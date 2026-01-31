import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTrades } from "../../store/trade.store";
import { useUserLogStore } from "../../store/userLog.store";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /* 🔁 AUTO LOGIN IF ALREADY LOGGED */
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const loggedId = localStorage.getItem("LOGGED_IN_USER_ID");

    if (savedUser && loggedId) {
      navigate("/dashboard");
    }
  }, [navigate]);

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    /* ================= GET USERS (SAFE) ================= */
    let users = useUserLogStore.getState().users;

    // 🔥 FALLBACK IF STORE NOT READY
    if (!users || users.length === 0) {
      try {
        const persisted = JSON.parse(
          localStorage.getItem("admin-user-log-store")
        );
        users = persisted?.state?.users || [];
      } catch {
        users = [];
      }
    }

    if (!users || users.length === 0) {
      setError("No users found. Please register first.");
      return;
    }

    /* ================= AUTH CHECK ================= */
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user || !user.id) {
      setError("Invalid email or password");
      return;
    }

    /* ================= LOGIN SUCCESS ================= */
    localStorage.setItem("auth_user", JSON.stringify(user));
    localStorage.setItem("user_logged_in", "true");
    localStorage.setItem("LOGGED_IN_USER_ID", String(user.id));

    // refresh trades for this user
    useTrades.getState().refreshTradesForUser();

    navigate("/dashboard");
  }

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Trading Journal</h2>
        <p style={subtitle}>Login to your account</p>

        {error && <div style={errorBox}>{error}</div>}

        <form onSubmit={handleLogin} style={form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          <button type="submit" style={button}>
            Login
          </button>
        </form>

        <p style={footer}>
          New user?{" "}
          <Link to="/register" style={link}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(180deg,#f8fafc,#eef2f7)",
};

const card = {
  width: "380px",
  padding: "34px",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const title = {
  textAlign: "center",
  fontSize: "26px",
  fontWeight: "700",
  color: "#0f172a",
};

const subtitle = {
  textAlign: "center",
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "28px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const input = {
  padding: "12px 14px",
  fontSize: "14px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};

const button = {
  marginTop: "10px",
  padding: "12px",
  fontSize: "15px",
  fontWeight: "600",
  borderRadius: "8px",
  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  fontSize: "13px",
  padding: "8px",
  borderRadius: "6px",
  marginBottom: "16px",
  textAlign: "center",
};

const footer = {
  marginTop: "22px",
  textAlign: "center",
  fontSize: "13px",
  color: "#475569",
};

const link = {
  color: "#2563eb",
  fontWeight: "600",
  textDecoration: "none",
};
