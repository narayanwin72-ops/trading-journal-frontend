export default function KPICard({ label, value }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        background: "var(--bg-card)",
        color: "var(--text-main)",
        border: "1px solid var(--border-color)",
        minWidth: "150px",
      }}
    >
      <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
        {label}
      </div>
      <div style={{ fontSize: "22px", fontWeight: "bold" }}>
        {value}
      </div>
    </div>
  );
}
