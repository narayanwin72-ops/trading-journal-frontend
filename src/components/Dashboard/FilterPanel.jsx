import MultiSelectDropdown from "../MultiSelectDropdown";

/* =====================================================
   FILTER PANEL UI (LOCK SAFE + TEXT)
===================================================== */

export default function FilterPanel({
  filters,
  setFilter,
  clearAllFilters,
  OPTIONS,
  filtersLocked = false,
  lockText = null,
}) {
  const safeSet = (key, value) => {
    if (filtersLocked) return;
    setFilter(key, value);
  };

  return (
    <>
      {/* DATE RANGE */}
      <div style={dateBar}>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => safeSet("from", e.target.value)}
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => safeSet("to", e.target.value)}
        />
        <button
          onClick={() => {
            if (filtersLocked) return;
            clearAllFilters();
          }}
          style={clearBtn}
        >
          Clear Filters
        </button>
      </div>

      {filtersLocked && lockText && (
        <div style={lockNote}>{lockText}</div>
      )}

      {/* FILTER GRID */}
      <div style={filterGrid}>
        {Object.keys(OPTIONS).map((key) => (
          <div key={key}>
            <MultiSelectDropdown
              label={labelMap[key]}
              options={OPTIONS[key]}
              selected={filters[key]}
              onChange={(v) => safeSet(key, v)}
            />
            {filtersLocked && lockText && (
              <div style={lockNote}>{lockText}</div>
            )}
          </div>
        ))}
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

const lockNote = {
  fontSize: "11px",
  marginTop: "4px",
  color: "#64748b",
};

const labelMap = {
  strategy: "Strategy",
  callPut: "Call / Put",
  position: "Position",
  confidence: "Confidence",
  entryReason: "Entry Reason",
  exitReason: "Exit Reason",
  broker: "Broker",
  timeframe: "Timeframe",
  timeRange: "Time Range",
  underlying: "Underlying",
  expiry: "Expiry",
  strike: "Strike",
};
