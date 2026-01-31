import MultiSelectDropdown from "../MultiSelectDropdown";

/* =====================================================
   FUTURES INTRADAY FILTER PANEL
===================================================== */

export default function FuturesFilterPanel({
  filters,
  setFilter,
  clearAllFilters,
  OPTIONS,
}) {
  return (
    <>
      {/* DATE RANGE */}
      <div style={dateBar}>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilter("from", e.target.value)}
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilter("to", e.target.value)}
        />
        <button onClick={clearAllFilters} style={clearBtn}>
          Clear Filters
        </button>
      </div>

      {/* FILTER GRID */}
      <div style={filterGrid}>
        <MultiSelectDropdown label="Symbol" options={OPTIONS.symbol} selected={filters.symbol} onChange={(v) => setFilter("symbol", v)} />
        <MultiSelectDropdown label="Position" options={OPTIONS.position} selected={filters.position} onChange={(v) => setFilter("position", v)} />
        <MultiSelectDropdown label="Strategy" options={OPTIONS.strategy} selected={filters.strategy} onChange={(v) => setFilter("strategy", v)} />
        <MultiSelectDropdown label="Timeframe" options={OPTIONS.timeframe} selected={filters.timeframe} onChange={(v) => setFilter("timeframe", v)} />
        <MultiSelectDropdown label="Time Range" options={OPTIONS.timeRange} selected={filters.timeRange} onChange={(v) => setFilter("timeRange", v)} />
        <MultiSelectDropdown label="Confidence" options={OPTIONS.confidence} selected={filters.confidence} onChange={(v) => setFilter("confidence", v)} />
        <MultiSelectDropdown label="Entry Reason" options={OPTIONS.entryReason} selected={filters.entryReason} onChange={(v) => setFilter("entryReason", v)} />
        <MultiSelectDropdown label="Exit Reason" options={OPTIONS.exitReason} selected={filters.exitReason} onChange={(v) => setFilter("exitReason", v)} />
        <MultiSelectDropdown label="Broker" options={OPTIONS.broker} selected={filters.broker} onChange={(v) => setFilter("broker", v)} />
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const dateBar = {
  display: "flex",
  gap: "12px",
  marginBottom: "14px",
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
