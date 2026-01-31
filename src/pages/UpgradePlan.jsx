import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanStore } from "../store/plan.store";
import { usePlanVariantStore } from "../store/planVariant.store";

export default function UpgradePlan() {
  const navigate = useNavigate();

  /* 🔥 SAFE STORE READ (NO FILTER HERE) */
  const allPlans = usePlanStore((s) => s.plans);
  const allVariants = usePlanVariantStore(
    (s) => s.variants
  );

  const authUser = JSON.parse(
    localStorage.getItem("auth_user")
  );

  const [planId, setPlanId] = useState("");
  const [variantId, setVariantId] = useState("");

  /* ================= ACTIVE PLANS ================= */
  const plans = useMemo(() => {
    return allPlans.filter((p) => p.isActive);
  }, [allPlans]);

  /* ================= FILTERED VARIANTS ================= */
  const planVariants = useMemo(() => {
    if (!planId) return [];
    return allVariants.filter(
      (v) => v.planId === planId && v.isActive
    );
  }, [allVariants, planId]);

  const selectedVariant = useMemo(() => {
    return planVariants.find(
      (v) => v.id === variantId
    );
  }, [planVariants, variantId]);

  /* ================= PAY HANDLER (FINAL FIX) ================= */
  function handlePayment() {
    if (
      !selectedVariant ||
      !selectedVariant.paymentLink ||
      !authUser
    )
      return;

    // 🔥 success redirect back to app
    const successUrl =
      window.location.origin +
      `/payment-success?userId=${authUser.id}&variantId=${selectedVariant.id}`;

    // 🔥 handle ? / & correctly
    const separator = selectedVariant.paymentLink.includes("?")
      ? "&"
      : "?";

    const paymentUrl =
      selectedVariant.paymentLink +
      `${separator}redirect_url=${encodeURIComponent(successUrl)}`;

    window.location.href = paymentUrl;
  }

  return (
    <div style={page}>
      <button
        style={backBtn}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2 style={title}>
        Upgrade your plan
      </h2>

      <p style={subtitle}>
        Unlock advanced features and insights
      </p>

      {/* PLAN SELECT */}
      <div style={card}>
        <label style={label}>
          Choose Plan
        </label>

        <select
          value={planId}
          onChange={(e) => {
            setPlanId(e.target.value);
            setVariantId("");
          }}
          style={select}
        >
          <option value="">
            -- Select Plan --
          </option>
          {plans.map((p) => (
            <option
              key={p.id}
              value={p.id}
            >
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* VARIANT SELECT */}
      {planId && (
        <div style={card}>
          <label style={label}>
            Choose Duration
          </label>

          <select
            value={variantId}
            onChange={(e) =>
              setVariantId(e.target.value)
            }
            style={select}
          >
            <option value="">
              -- Select Duration --
            </option>

            {planVariants.map((v) => (
              <option
                key={v.id}
                value={v.id}
              >
                {v.name.replace("_", " ")} — ₹
                {v.price}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* PRICE + CTA */}
      {selectedVariant && (
        <div style={summary}>
          <div style={amount}>
            ₹{selectedVariant.price}
          </div>

          <button
            style={payBtn}
            onClick={handlePayment}
          >
            Upgrade to unlock new features
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const page = {
  maxWidth: "520px",
  margin: "40px auto",
};

const backBtn = {
  background: "transparent",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
  marginBottom: "10px",
};

const title = {
  fontSize: "26px",
  fontWeight: "700",
  marginBottom: "6px",
};

const subtitle = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "24px",
};

const card = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "16px",
};

const label = {
  display: "block",
  fontSize: "14px",
  marginBottom: "6px",
};

const select = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
};

const summary = {
  marginTop: "24px",
  padding: "20px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  textAlign: "center",
};

const amount = {
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "14px",
};

const payBtn = {
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  borderRadius: "999px",
  border: "none",
  background: "#16a34a",
  color: "#ffffff",
  cursor: "pointer",
};
