// src/components/Card/ChartCard.jsx

export default function ChartCard({ title, children }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "14px",
        background: "#ffffff",
        minHeight: "220px",
        width: "100%",
      }}
    >
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}
