import { usePlanStore } from "../../../store/plan.store";
import { useTradeLogFeatureStore } from "../../../store/tradeLogFeature.store";

const FILTERS = [
  "DATE",
  "SYMBOL",
  "OPTIONTYPE",
  "POSITION",
  "EXPIRY",
  "STRIKE",
  "STRATEGY",
  "ENTRYREASON",
  "EXITREASON",
  "CONFIDENCE",
  "TIMEFRAME",
  "BROKER",
];

export default function OptionsTradeLogControl() {
  const plans = usePlanStore((s) => s.plans);
  const { features, updateAllowedPlans } =
    useTradeLogFeatureStore();

  function getFeature(fid) {
    return features.find((f) => f.featureId === fid);
  }

  function toggle(fid, planId) {
    const f = getFeature(fid);
    const allowed = f?.allowedPlans || [];
    const updated = allowed.includes(planId)
      ? allowed.filter((p) => p !== planId)
      : [...allowed, planId];

    updateAllowedPlans(fid, updated);
  }

  return (
    <table style={table}>
      <thead>
        <tr>
          <th style={th}>Feature</th>
          {plans.map((p) => (
            <th key={p.id} style={th}>{p.name}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {/* ===== TAB ===== */}
        <tr>
          <td style={{ ...td, fontWeight: 700 }}>
            Options Trade Log Tab
          </td>
          {plans.map((p) => (
            <td key={p.id} style={tdCenter}>
              <input
                type="checkbox"
                checked={
                  getFeature("TRADELOG_OPTIONS_TAB")
                    ?.allowedPlans.includes(p.id) || false
                }
                onChange={() =>
                  toggle("TRADELOG_OPTIONS_TAB", p.id)
                }
              />
            </td>
          ))}
        </tr>

        {/* ===== FILTERS ===== */}
        {FILTERS.map((f) => {
          const fid = `TRADELOG_OPTIONS_${f}`;
          return (
            <tr key={fid}>
              <td style={td}>{fid}</td>
              {plans.map((p) => (
                <td key={p.id} style={tdCenter}>
                  <input
                    type="checkbox"
                    checked={
                      getFeature(fid)
                        ?.allowedPlans.includes(p.id) || false
                    }
                    onChange={() => toggle(fid, p.id)}
                  />
                </td>
              ))}
            </tr>
          );
        })}

        {/* ===== EXPORT ===== */}
        {["EXCEL", "PDF"].map((x) => {
          const fid = `TRADELOG_OPTIONS_${x}`;
          return (
            <tr key={fid}>
              <td style={td}>{fid}</td>
              {plans.map((p) => (
                <td key={p.id} style={tdCenter}>
                  <input
                    type="checkbox"
                    checked={
                      getFeature(fid)
                        ?.allowedPlans.includes(p.id) || false
                    }
                    onChange={() => toggle(fid, p.id)}
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ===== styles ===== */
const table = { width:"100%", borderCollapse:"collapse" };
const th = { border:"1px solid #cbd5e1", padding:8, background:"#f1f5f9" };
const td = { border:"1px solid #cbd5e1", padding:8 };
const tdCenter = { ...td, textAlign:"center" };
