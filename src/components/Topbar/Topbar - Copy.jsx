import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTrades } from "../../store/trade.store";
import ChangePasswordModal from "../ChangePasswordModal";

export default function Topbar() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const user = JSON.parse(localStorage.getItem("auth_user"));
  if (!user) return null;

  function handleLogout() {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user_logged_in");

    useTrades.getState().refreshTradesForUser();
    navigate("/login");
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedUser = { ...user, avatar: reader.result };

      // update auth user
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));

      // sync users list
      let users = JSON.parse(localStorage.getItem("users") || "[]");
      users = users.map((u) =>
        u.user_id === user.user_id ? updatedUser : u
      );
      localStorage.setItem("users", JSON.stringify(users));

      window.location.reload();
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <div style={bar}>
        {/* LEFT */}
        <div style={title}>Trading Journal</div>

        {/* RIGHT USER */}
        <div style={{ position: "relative" }}>
          <div
            style={profile}
            onClick={() => setOpen(!open)}
          >
            <div style={avatar}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                (user.name || user.email)[0].toUpperCase()
              )}
            </div>

            <span style={name}>{user.name}</span>
          </div>

          {/* DROPDOWN */}
          {open && (
            <div style={dropdown}>
              {/* USER INFO */}
              <div style={userInfo}>
                <strong>{user.name}</strong>
                <div style={email}>{user.email}</div>
              </div>

              {/* PROFILE IMAGE */}
              <div
                style={item}
                onClick={() => fileRef.current.click()}
              >
                Upload Profile Image
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />

              <div style={divider} />

              {/* CHANGE PASSWORD */}
              <div
                style={item}
                onClick={() => {
                  setShowChangePassword(true);
                  setOpen(false);
                }}
              >
                Change Password
              </div>

              <div style={divider} />

              {/* LOGOUT */}
              <div style={logout} onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </>
  );
}

/* ================= STYLES ================= */

const bar = {
  height: "60px",
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
};

const title = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#0f172a",
};

const profile = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
};

const avatar = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "#2563eb",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  overflow: "hidden",
};

const name = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#0f172a",
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: "48px",
  width: "260px",
  background: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  overflow: "hidden",
  zIndex: 100,
};

const userInfo = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
};

const email = {
  fontSize: "12px",
  color: "#64748b",
  marginTop: "4px",
};

const item = {
  padding: "12px 14px",
  fontSize: "14px",
  cursor: "pointer",
  color: "#0f172a",
};

const logout = {
  padding: "12px 14px",
  fontSize: "14px",
  cursor: "pointer",
  color: "#dc2626",
};

const divider = {
  height: "1px",
  background: "#e5e7eb",
};
