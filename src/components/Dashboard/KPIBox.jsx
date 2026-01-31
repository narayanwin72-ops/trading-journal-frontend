export default function KPIBox({ label, value, color }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "16px",
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
        transition: "transform 0.2s",
      }}
    >
      <div style={{ fontSize: "13px", color: "#6b7280" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: "22px",
          fontWeight: 800,
          color,
          marginTop: "6px",
        }}
      >
        {value}
      </div>
    </div>
  );
}
