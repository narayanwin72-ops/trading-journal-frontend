import { useState, useRef, useEffect } from "react";

export default function MultiSelectDropdown({
  label,
  options = [],
  selected = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* ===== CLOSE ON OUTSIDE CLICK ===== */
  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function toggleValue(value) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div ref={ref} style={wrapper}>
      <label style={labelStyle}>{label}</label>

      {/* ===== HEADER ===== */}
      <div
        style={header}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <span style={{ fontSize: "13px", color: selected.length ? "#111" : "#6b7280" }}>
          {selected.length ? selected.join(", ") : `Select ${label}`}
        </span>
        <span>▾</span>
      </div>

      {/* ===== DROPDOWN ===== */}
      {open && (
        <div style={menu}>
          {options.length === 0 && (
            <div style={empty}>No options</div>
          )}

          {options.map((opt) => (
            <div
              key={opt}
              style={item}
              onClick={(e) => {
                e.stopPropagation();   // 🔥 MAIN FIX
                toggleValue(opt);
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                readOnly
              />
              <span style={{ marginLeft: "8px" }}>{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper = {
  position: "relative",
  width: "100%",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "4px",
  display: "block",
};

const header = {
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "8px 10px",
  background: "#fff",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const menu = {
  position: "absolute",
  top: "110%",
  left: 0,
  right: 0,
  maxHeight: "240px",
  overflowY: "auto",
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  zIndex: 1000,
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
};

const item = {
  padding: "8px 10px",
  display: "flex",
  alignItems: "center",
  fontSize: "13px",
  cursor: "pointer",
};

const empty = {
  padding: "10px",
  fontSize: "13px",
  color: "#6b7280",
};
