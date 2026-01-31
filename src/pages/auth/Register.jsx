import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTrades } from "../../store/trade.store";
import { useUserLogStore } from "../../store/userLog.store";
import { useTrialStore } from "../../store/trial.store";
import { usePlanStore } from "../../store/plan.store";
import { generateUserId } from "../../utils/generateUserId";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !password || !confirm) {
      setError("All fields are required");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    /* ================= SINGLE SOURCE OF TRUTH ================= */
    const { users, addUser } = useUserLogStore.getState();

    if (users.find((u) => u.email === email)) {
      setError("Email already registered. Please login.");
      return;
    }

    const now = Date.now();
    const userId = generateUserId();

    /* ================= TRIAL / PLAN LOGIC ================= */
    const trialConfig = useTrialStore.getState().trial;
    const plans = usePlanStore.getState().plans;

    let planData = null;

    if (
      trialConfig?.enabled &&
      trialConfig?.trialPlanId &&
      trialConfig?.durationDays
    ) {
      const trialPlan = plans.find(
        (p) => p.id === trialConfig.trialPlanId
      );

      if (trialPlan) {
        const days = Number(trialConfig.durationDays);

        planData = {
          planId: trialPlan.id,
          planName: `${trialPlan.name} (Trial)`,
          variantId: "TRIAL",
          variantName: `TRIAL (${days} Days)`, // 🔥 FIX
          trialDays: days,                     // 🔥 NEW
          trialType: "AUTO",                   // 🔥 NEW
          startDate: now,
          expiryDate: now + days * 24 * 60 * 60 * 1000,
          isTrial: true,
        };
      }
    }

    /* ================= FALLBACK FREE PLAN ================= */
    if (!planData) {
      planData = {
        planId: "FREE",
        planName: "FREE",
        variantId: "FREE",
        variantName: "FREE",   // 🔥 CONSISTENT
        trialDays: 0,
        startDate: now,
        expiryDate: null,
        isTrial: false,
      };
    }

    /* ================= ADD USER (ADMIN USER LOG) ================= */
    const fullUser = {
      id: userId,
      name,
      email,
      phone,
      password,               // 🔑 REQUIRED FOR LOGIN
      registrationDate: now,
      status: "ACTIVE",
      plan: planData,
    };

    addUser(fullUser);

    /* ================= AUTO LOGIN ================= */
    localStorage.setItem("auth_user", JSON.stringify(fullUser));
    localStorage.setItem("user_logged_in", "true");
    localStorage.setItem("LOGGED_IN_USER_ID", userId);

    // refresh trades for this user
    useTrades.getState().refreshTradesForUser();

    navigate("/dashboard");
  }

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Create Account</h2>
        <p style={subtitle}>Start your trading journal</p>

        {error && <div style={errorBox}>{error}</div>}

        <form onSubmit={handleRegister} style={form}>
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <input
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={input}
          />

          <button type="submit" style={button}>
            Create Account
          </button>
        </form>

        <p style={footer}>
          Already have an account?{" "}
          <Link to="/login" style={link}>
            Login
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
};

const card = {
  width: "420px",
  padding: "36px",
  background: "#fff",
  borderRadius: "12px",
};

const title = {
  textAlign: "center",
  fontSize: "26px",
  fontWeight: "700",
};

const subtitle = {
  textAlign: "center",
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "26px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};

const button = {
  padding: "13px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
};

const footer = {
  marginTop: "22px",
  textAlign: "center",
  fontSize: "13px",
};

const link = {
  color: "#2563eb",
  fontWeight: "600",
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "8px",
  borderRadius: "6px",
};
