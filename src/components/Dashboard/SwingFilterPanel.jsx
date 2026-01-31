import MultiSelectDropdown from "../MultiSelectDropdown";

/* =====================================================
   SWING – FILTER PANEL
   (EXACT SAME UI AS OPTIONS / FUTURES / EQUITY)
===================================================== */

export default function SwingFilterPanel({
  filters,
  setFilter,
  clearAllFilters,
  OPTIONS,
}) {
  return (
    <>
      {/* ===== DATE RANGE ===== */}
      <div style={dateBar}>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilter("fromDate", e.target.value)}
        />

        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilter("toDate", e.target.value)}
        />

        <button onClick={clearAllFilters} style={clearBtn}>
          Clear Filters
        </button>
      </div>

      {/* ===== FILTER GRID ===== */}
      <div style={filterGrid}>
        <MultiSelectDropdown
          label="Symbol"
          options={OPTIONS.symbols}
          selected={filters.symbol}
          onChange={(v) => setFilter("symbol", v)}
        />

        <MultiSelectDropdown
          label="Position"
          options={OPTIONS.positions}
          selected={filters.position}
          onChange={(v) => setFilter("position", v)}
        />

        <MultiSelectDropdown
          label="Strategy"
          options={OPTIONS.strategies}
          selected={filters.strategy}
          onChange={(v) => setFilter("strategy", v)}
        />

        <MultiSelectDropdown
          label="Timeframe"
          options={OPTIONS.timeframes}
          selected={filters.timeframe}
          onChange={(v) => setFilter("timeframe", v)}
        />

        <MultiSelectDropdown
          label="Entry Reason"
          options={OPTIONS.reasons}
          selected={filters.reason}
          onChange={(v) => setFilter("reason", v)}
        />

        {/* ✅ EXIT REASON ADDED */}
        <MultiSelectDropdown
          label="Exit Reason"
          options={OPTIONS.exitReasons}
          selected={filters.exitReason}
          onChange={(v) => setFilter("exitReason", v)}
        />

        <MultiSelectDropdown
          label="Confidence"
          options={OPTIONS.confidences}
          selected={filters.confidence}
          onChange={(v) => setFilter("confidence", v)}
        />

        <MultiSelectDropdown
          label="Broker"
          options={OPTIONS.brokers}
          selected={filters.broker}
          onChange={(v) => setFilter("broker", v)}
        />
      </div>
    </>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const dateBar = {
  display: "flex",
  gap: "12px",
  marginBottom: "14px",
  alignItems: "center",
};

const clearBtn = {
  padding: "6px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  background: "#fff",
  cursor: "pointer",
};

const filterGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "12px",
  background: "#fff",
  padding: "14px",
  borderRadius: "12px",
};
