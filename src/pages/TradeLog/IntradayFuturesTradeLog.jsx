import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTrades } from "../../store/trade.store";

/* ================= UTIL ================= */

function show(val) {
  if (val === undefined || val === null || val === "") return "-";
  return val;
}

/* ================= MAIN ================= */

export default function IntradayFuturesTradeLog() {
  const navigate = useNavigate();

  const { trades, deleteTrade, setEditTradeId } = useTrades();

  // ✅ ONLY FUTURES INTRADAY
  const futuresTrades = trades.filter(
    (t) => t.tradeType === "FUTURES_INTRADAY"
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [previewRemarks, setPreviewRemarks] = useState(null);

  /* ===== DATE FILTER ===== */
  const filteredTrades = useMemo(() => {
    return futuresTrades.filter((t) => {
      if (!fromDate && !toDate) return true;
      if (!t.date) return false;

      const d = new Date(t.date);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;

      return true;
    });
  }, [futuresTrades, fromDate, toDate]);

  /* ===== EXCEL DOWNLOAD ===== */
  function downloadExcel() {
    const headers = HEADERS;

    const rows = filteredTrades.map((t) =>
      headers.map((h) => show(t[KEY_MAP[h]])).join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "intraday-futures-trade-log.csv";
    link.click();
  }

  return (
    <div style={container}>
      <h3 style={{ marginBottom: "12px" }}>Intraday Futures Trade Log</h3>

      {/* ===== FILTER BAR ===== */}
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
                <th style={{ ...th, textAlign: "center" }}>Remarks</th>
                <th style={{ ...th, textAlign: "center" }}>Chart</th>
                <th style={{ ...th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTrades.map((t) => (
                <tr key={t.id}>
                  {HEADERS.map((h) => (
                    <td key={h} style={td}>
                      {show(t[KEY_MAP[h]])}
                    </td>
                  ))}

                  {/* ===== REMARKS ===== */}
                  <td style={{ ...td, textAlign: "center" }}>
                    {t.remarks ? (
                      <button
                        style={iconBtn}
                        onClick={() => setPreviewRemarks(t.remarks)}
                      >
                        👁️
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* ===== CHART ===== */}
                  <td style={{ ...td, textAlign: "center" }}>
                    {t.chartImage ? (
                      <button
                        style={iconBtn}
                        onClick={() => setPreviewImg(t.chartImage)}
                      >
                        🖼️
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* ===== ACTIONS ===== */}
                  <td style={{ ...td, textAlign: "center" }}>
                    <button
                      style={iconBtn}
                      onClick={() => {
                        setEditTradeId(t.id, "FUTURES_INTRADAY");
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

      {/* ===== IMAGE POPUP ===== */}
      {previewImg && (
        <div style={modal} onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="chart" style={modalImg} />
        </div>
      )}

      {/* ===== REMARKS POPUP ===== */}
      {previewRemarks && (
        <div style={modal} onClick={() => setPreviewRemarks(null)}>
          <div
            style={{
              background: "#fff",
              padding: "20px",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "12px",
            }}
          >
            <h4 style={{ marginBottom: "12px" }}>Remarks</h4>
            <div style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
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
  "Date","Time","Time Range","Symbol","Position",
  "Entry","SL","Target","Qty",
  "Strategy","Timeframe","Reason","Confidence",
  "Exit Price","Exit Time","Exit Reason",
  "Charges","Broker","Capital"
];

const KEY_MAP = {
  "Date": "date",
  "Time": "time",
  "Time Range": "timeRange",
  "Symbol": "symbol",
  "Position": "position",
  "Entry": "entry",
  "SL": "sl",
  "Target": "target",
  "Qty": "qty",
  "Strategy": "strategy",
  "Timeframe": "timeframe",
  "Reason": "reason",
  "Confidence": "confidence",
  "Exit Price": "exitPrice",
  "Exit Time": "exitTime",
  "Exit Reason": "exitReason",
  "Charges": "charges",
  "Broker": "broker",
  "Capital": "capital",
};

/* ================= STYLES ================= */

const container = { background:"#fff", padding:"16px", borderRadius:"12px" };
const filterBar = { display:"flex", gap:"10px", marginBottom:"12px", alignItems:"center" };
const downloadBtn = { padding:"8px 14px", borderRadius:"8px", border:"none", background:"#0f172a", color:"#fff", cursor:"pointer" };
const table = { width:"100%", borderCollapse:"collapse" };
const th = { border:"1px solid #1f2937", padding:"8px", background:"#e5e7eb", fontSize:"12px", fontWeight:700, whiteSpace:"nowrap", position:"sticky", top:0, zIndex:10 };
const td = { border:"1px solid #1f2937", padding:"8px", fontSize:"12px", whiteSpace:"nowrap", textAlign:"center" };
const iconBtn = { border:"none", background:"transparent", cursor:"pointer", fontSize:"16px", margin:"0 4px" };
const modal = { position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:999 };
const modalImg = { maxWidth:"90%", maxHeight:"90%", borderRadius:"12px" };
