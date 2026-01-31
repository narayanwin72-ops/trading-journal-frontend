import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTrades } from "../../store/trade.store";

/* ================= UTIL ================= */
function show(val) {
  if (val === undefined || val === null || val === "") return "-";
  return val;
}

/* ================= MAIN ================= */
export default function PositionalOptionTradeLog() {
  const navigate = useNavigate();
  const { trades, deleteTrade, setEditTradeId } = useTrades();

  /* ✅ ONLY POSITIONAL OPTION TRADES */
  const optionTrades = trades.filter(
    (t) => t.tradeType === "OPTIONS_POSITIONAL"
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [previewRemarks, setPreviewRemarks] = useState(null);

  /* ===== DATE FILTER ===== */
  const filteredTrades = useMemo(() => {
    return optionTrades.filter((t) => {
      const d = new Date(t.entryDate || t.date);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;
      return true;
    });
  }, [optionTrades, fromDate, toDate]);

  /* ===== EXCEL DOWNLOAD ===== */
  function downloadExcel() {
    const rows = filteredTrades.map((t) =>
      HEADERS.map((h) =>
        show(
          typeof KEY_MAP[h] === "function"
            ? KEY_MAP[h](t)
            : t[KEY_MAP[h]]
        )
      ).join(",")
    );

    const csv = [HEADERS.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "positional-option-trade-log.csv";
    link.click();
  }

  return (
    <div style={container}>
      <h3 style={{ marginBottom: "12px" }}>
        Positional Option Trade Log
      </h3>

      {/* ===== FILTER ===== */}
      <div style={filterBar}>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button style={downloadBtn} onClick={downloadExcel}>
          ⬇ Download Excel
        </button>
      </div>

      {!filteredTrades.length && (
        <div style={{ color: "#6b7280" }}>No trades found</div>
      )}

      {filteredTrades.length > 0 && (
        <div style={{ overflow: "auto", maxHeight: "70vh" }}>
          <table style={table}>
            <thead>
              <tr>
                {HEADERS.map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
                <th style={th}>Remarks</th>
                <th style={th}>Chart</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTrades.map((t) => (
                <tr key={t.id}>
                  {HEADERS.map((h) => (
                    <td key={h} style={td}>
                      {show(
                        typeof KEY_MAP[h] === "function"
                          ? KEY_MAP[h](t)
                          : t[KEY_MAP[h]]
                      )}
                    </td>
                  ))}

                  {/* REMARKS */}
                  <td style={td}>
                    {t.remarks ? (
                      <button
                        style={iconBtn}
                        onClick={() => setPreviewRemarks(t.remarks)}
                      >
                        👁️
                      </button>
                    ) : "-"}
                  </td>

                  {/* CHART */}
                  <td style={td}>
                    {t.chartImage ? (
                      <button
                        style={iconBtn}
                        onClick={() => setPreviewImg(t.chartImage)}
                      >
                        🖼️
                      </button>
                    ) : "-"}
                  </td>

                  {/* ACTIONS */}
                  <td style={td}>
                    <button
                      style={iconBtn}
                      onClick={() => {
                        setEditTradeId(t.id, "POSITIONAL");
                        navigate("/trade-entry");
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      style={iconBtn}
                      onClick={() => {
                        if (window.confirm("Delete this trade?")) {
                          deleteTrade(t.id);
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewImg && (
        <div style={modal} onClick={() => setPreviewImg(null)}>
          <img src={previewImg} style={modalImg} />
        </div>
      )}

      {/* REMARKS PREVIEW */}
      {previewRemarks && (
        <div style={modal} onClick={() => setPreviewRemarks(null)}>
          <div style={remarksBox}>
            <h4>Remarks</h4>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {previewRemarks}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= CONSTANTS ================= */

const HEADERS = [
  "Entry Date",
  "Exit Date",        // ✅ ADDED
  "Underlying",
  "Expiry",
  "Strike",
  "Type",
  "Position",
  "Entry",
  "SL",
  "Target",
  "Qty",
  "Entry Reason",
  "Strategy",
  "Timeframe",
  "Confidence",
  "Exit Price",
  "Exit Reason",
  "Charges",
  "Broker",
  "Capital",
];

const KEY_MAP = {
  "Entry Date": (t) => t.entryDate || t.date,
  "Exit Date": (t) => t.exitDate || "-",   // ✅ ADDED
  "Underlying": "underlying",
  "Expiry": "expiry",
  "Strike": "strike",
  "Type": "optionType",
  "Position": "position",
  "Entry": "entry",
  "SL": "sl",
  "Target": "target",
  "Qty": "qty",
  "Entry Reason": "reason",
  "Strategy": "strategy",
  "Timeframe": "timeframe",
  "Confidence": "confidence",
  "Exit Price": "exitPrice",
  "Exit Reason": "exitReason",
  "Charges": "charges",
  "Broker": "broker",
  "Capital": "capital",
};

/* ================= STYLES ================= */

const container = { background:"#fff", padding:"16px", borderRadius:"12px" };
const filterBar = { display:"flex", gap:"10px", marginBottom:"12px" };
const downloadBtn = { padding:"8px 14px", borderRadius:"8px", background:"#0f172a", color:"#fff", border:"none", cursor:"pointer" };
const table = { width:"100%", borderCollapse:"collapse" };
const th = { border:"1px solid #1f2937", padding:"8px", background:"#e5e7eb", fontSize:"12px", position:"sticky", top:0 };
const td = { border:"1px solid #1f2937", padding:"8px", fontSize:"12px", textAlign:"center" };
const iconBtn = { border:"none", background:"transparent", cursor:"pointer", fontSize:"16px" };
const modal = { position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:999 };
const modalImg = { maxWidth:"90%", maxHeight:"90%", borderRadius:"12px" };
const remarksBox = { background:"#fff", padding:"20px", maxWidth:"600px", borderRadius:"12px" };
