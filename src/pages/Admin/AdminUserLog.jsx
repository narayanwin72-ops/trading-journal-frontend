import { useState, useMemo } from "react";
import { useUserLogStore } from "../../store/userLog.store";
import { usePlanStore } from "../../store/plan.store";

export default function AdminUserLog() {
  const {
    users,
    updateUserPlan,
    updateExpiry,
    setUserStatus,
  } = useUserLogStore();

  const plans = usePlanStore((s) => s.plans);

  /* ================= FILTER STATES ================= */
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortExpiry, setSortExpiry] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= FILTER LOGIC ================= */
  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.includes(q) ||
          u.id?.includes(q)
      );
    }

    if (planFilter) {
      list = list.filter(
        (u) => u.plan?.planId === planFilter
      );
    }

    if (typeFilter) {
      list = list.filter(
        (u) => u.plan?.planType === typeFilter
      );
    }

    if (statusFilter) {
      list = list.filter(
        (u) => u.status === statusFilter
      );
    }

    if (fromDate) {
      const from = new Date(fromDate).getTime();
      list = list.filter(
        (u) => u.registrationDate >= from
      );
    }

    if (toDate) {
      const to =
        new Date(toDate).getTime() +
        24 * 60 * 60 * 1000;
      list = list.filter(
        (u) => u.registrationDate <= to
      );
    }

    if (sortExpiry) {
      list.sort((a, b) => {
        const aD = a.plan?.expiryDate || 0;
        const bD = b.plan?.expiryDate || 0;
        return sortExpiry === "ASC"
          ? aD - bD
          : bD - aD;
      });
    }

    return list;
  }, [
    users,
    search,
    planFilter,
    typeFilter,
    statusFilter,
    sortExpiry,
    fromDate,
    toDate,
  ]);

  function daysLeft(expiry) {
    if (!expiry) return "-";
    return Math.ceil(
      (expiry - Date.now()) / 86400000
    );
  }

  /* ================= EXPORT ================= */
  function exportCSV() {
    const headers = [
      "User ID",
      "Name",
      "Email",
      "Phone",
      "Registered",
      "Plan",
      "Type",
      "Expiry",
      "Days Left",
      "Status",
    ];

    const rows = filteredUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.phone,
      new Date(
        u.registrationDate
      ).toLocaleDateString(),
      u.plan?.planName || "",
      u.plan?.planType || "",
      u.plan?.expiryDate
        ? new Date(
            u.plan.expiryDate
          ).toLocaleDateString()
        : "",
      daysLeft(u.plan?.expiryDate),
      u.status,
    ]);

    const csv =
      [headers, ...rows]
        .map((r) => r.join(","))
        .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_log.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h2>User Log</h2>

      {/* ================= FILTER BAR ================= */}
      <div style={filterBar}>
        <input
          placeholder="Search user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(e.target.value)
          }
          style={input}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            setToDate(e.target.value)
          }
          style={input}
        />

        <select
          value={planFilter}
          onChange={(e) =>
            setPlanFilter(e.target.value)
          }
          style={input}
        >
          <option value="">All Plans</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
          style={input}
        >
          <option value="">All Types</option>
          <option value="FREE">FREE</option>
          <option value="TRIAL">TRIAL</option>
          <option value="PAID">PAID</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={input}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>

        <select
          value={sortExpiry}
          onChange={(e) =>
            setSortExpiry(e.target.value)
          }
          style={input}
        >
          <option value="">Sort Expiry</option>
          <option value="ASC">Days Left ↑</option>
          <option value="DESC">Days Left ↓</option>
        </select>

        <button onClick={exportCSV} style={btn}>
          Export CSV
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>#</th>
            <th style={th}>User ID</th>
            <th style={th}>Registered</th>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Phone</th>
            <th style={th}>Plan</th>
            <th style={th}>Type</th>
            <th style={th}>Start</th>
            <th style={th}>Expiry</th>
            <th style={th}>Days Left</th>
            <th style={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, i) => (
            <tr key={u.id}>
              <td style={td}>{i + 1}</td>
              <td style={td}>{u.id}</td>
              <td style={td}>
                {new Date(
                  u.registrationDate
                ).toLocaleDateString()}
              </td>
              <td style={td}>{u.name}</td>
              <td style={td}>{u.email}</td>
              <td style={td}>{u.phone}</td>

              {/* PLAN */}
              <td style={td}>
                <select
                  style={cellFull}
                  value={u.plan?.planId || ""}
                  onChange={(e) => {
                    const plan = plans.find(
                      (p) => p.id === e.target.value
                    );
                    if (!plan) return;
                    updateUserPlan(u.id, {
                      planId: plan.id,
                      planName: plan.name,
                      startDate: Date.now(),
                    });
                    /* 🔥 SIGNAL USER APP THAT PLAN CHANGED */
                    localStorage.setItem(
                     "USER_PLAN_UPDATED_AT",
                   Date.now().toString()
                   );
                  }}
                >
                  <option value="">None</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* TYPE */}
              <td style={td}>
                <select
                  style={cellFull}
                  value={u.plan?.planType || ""}
                  onChange={(e) =>
                    updateUserPlan(u.id, {
                      planType: e.target.value,
                    })
                  }
                >
                  <option value="">-</option>
                  <option value="FREE">FREE</option>
                  <option value="TRIAL">TRIAL</option>
                  <option value="PAID">PAID</option>
                </select>
              </td>

              <td style={td}>
                {u.plan?.startDate
                  ? new Date(
                      u.plan.startDate
                    ).toLocaleDateString()
                  : "-"}
              </td>

              {/* EXPIRY */}
              <td style={td}>
                <input
                  type="date"
                  style={cellFull}
                  value={
                    u.plan?.expiryDate
                      ? new Date(
                          u.plan.expiryDate
                        )
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    updateExpiry(
                      u.id,
                      new Date(
                        e.target.value
                      ).getTime()
                    )
                  }
                />
              </td>

              <td style={td}>
                {daysLeft(u.plan?.expiryDate)}
              </td>

              {/* STATUS */}
              <td style={td}>
                <select
                  style={cellFull}
                  value={u.status}
                  onChange={(e) =>
                    setUserStatus(
                      u.id,
                      e.target.value
                    )
                  }
                >
                  <option value="ACTIVE">
                    ACTIVE
                  </option>
                  <option value="BLOCKED">
                    BLOCKED
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= STYLES ================= */

const filterBar = {
  display: "flex",
  gap: 8,
  marginBottom: 12,
  flexWrap: "wrap",
};

const input = { padding: 6 };

const btn = {
  padding: "6px 10px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const th = {
  border: "1px solid #cbd5e1",
  padding: 8,
  background: "#f1f5f9",
};

const td = {
  border: "1px solid #cbd5e1",
  padding: 8,
};

const cellFull = {
  width: "100%",
  border: "none",
  background: "transparent",
  outline: "none",
  textAlign: "center",
  fontSize: 13,
};
