export default function EquityTradeLogControl() {
  return (
    <div
      style={{
        padding: 20,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
      }}
    >
      <h3>Equity Intraday Trade Log Control</h3>

      <p style={{ color: "#64748b", marginTop: 6 }}>
        Configure filters, rows and exports for Equity Intraday trades.
      </p>

      <div style={box}>
        🚧 Equity trade log settings will come here
      </div>
    </div>
  );
}

const box = {
  marginTop: 20,
  padding: 16,
  border: "1px dashed #cbd5e1",
  borderRadius: 6,
  background: "#f8fafc",
};
