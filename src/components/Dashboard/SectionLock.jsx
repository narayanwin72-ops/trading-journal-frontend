import { useDashboardFeatureStore } from "../../store/dashboardFeature.store";
import { useUserPlanStore } from "../../store/userPlan.store";
import { usePlanStore } from "../../store/plan.store";

/*
  SectionLock – FINAL UX FIX (TEXT FORMAT FINAL)
  ---------------------------------------------
  ✔ Unlocked → no overlay, no extra text
  ✔ Locked → inner content blurred
  ✔ Locked → heading shown as: 🔒 Win / Loss Day Analysis
  ✔ Locked → "Upgrade plan to unlock"
  ✔ No style / spacing / UX change
*/

export default function SectionLock({
  featureId,
  title,          // exact section heading text
  children,
}) {
  const planId = useUserPlanStore((s) => s.activePlanId);
  const { canUse } = useDashboardFeatureStore();
  const unlocked = canUse(featureId, planId);

  /* ================= UNLOCKED ================= */
  if (unlocked) {
    return (
      <div style={sectionWrap}>
        {children}
      </div>
    );
  }

  /* ================= LOCKED ================= */
  return (
    <div style={sectionWrap}>
      <div style={contentBox}>
        <div style={blurLayer}>
          {children}
        </div>

        <div style={overlay}>
          <div style={overlayCard}>
            <div style={overlayTitle}>
              🔒 {title}
            </div>
            <div style={overlaySub}>
              Upgrade plan to unlock
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const sectionWrap = {
  marginBottom: 28,
};

const contentBox = {
  position: "relative",
  borderRadius: 12,
};

const blurLayer = {
  filter: "blur(4px)",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(255,255,255,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
};

const overlayCard = {
  background: "#ffffff",
  padding: "10px 18px",
  borderRadius: 14,
  textAlign: "center",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
};

const overlayTitle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#111827",
};

const overlaySub = {
  marginTop: 4,
  fontSize: 12,
  fontWeight: 600,
  color: "#475569",
};
