import { useState } from "react";

export default function ChangePasswordModal({ onClose }) {
  const user = JSON.parse(localStorage.getItem("auth_user"));

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [msg, setMsg] = useState("");

  function handleUpdate() {
    setMsg("");

    if (!oldPass || !newPass || !confirmPass) {
      setMsg("All fields are required");
      return;
    }

    if (oldPass !== user.password) {
      setMsg("Old password is incorrect");
      return;
    }

    if (newPass !== confirmPass) {
      setMsg("New passwords do not match");
      return;
    }

    const updatedUser = { ...user, password: newPass };

    // update auth user
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));

    // update users list
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users = users.map((u) =>
      u.user_id === user.user_id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(users));

    setMsg("✅ Password updated successfully");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={title}>Change Password</h3>

        <input
          type="password"
          placeholder="Old password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="New password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          style={input}
        />

        {msg && <div style={msgBox}>{msg}</div>}

        <div style={actions}>
          <button onClick={onClose} style={cancel}>
            Cancel
          </button>
          <button onClick={handleUpdate} style={save}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modal = {
  width: "420px",
  background: "#ffffff",
  borderRadius: "12px",
  padding: "28px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const title = {
  marginBottom: "6px",
  fontSize: "20px",
  fontWeight: 700,
  color: "#0f172a",
};

const input = {
  padding: "12px",
  fontSize: "14px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};

const msgBox = {
  fontSize: "13px",
  color: "#0f172a",
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "10px",
};

const cancel = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  cursor: "pointer",
};

const save = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 600,
  cursor: "pointer",
};
