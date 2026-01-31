import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrades } from "../../store/trade.store";
import { useUserLogStore } from "../../store/userLog.store";
import { usePlanStore } from "../../store/plan.store";
import ChangePasswordModal from "../ChangePasswordModal";

export default function Topbar() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] =
    useState(false);

  /* ================= AUTH USER ================= */
  const authUser = JSON.parse(
    localStorage.getItem("auth_user")
  );
  if (!authUser) return null;

  /* ================= SOURCE OF TRUTH ================= */
  const users = useUserLogStore((s) => s.users);
  const plans = usePlanStore((s) => s.plans);

  const currentUser = users.find(
    (u) => u.id === authUser.id
  );

  /* ================= PLAN DATA (FROM USER LOG) ================= */
  const activePlanName =
    currentUser?.plan?.planName || "FREE";

  const activePlanId =
    currentUser?.plan?.planId || "PLAN_FREE";

  const expiryDate =
    currentUser?.plan?.expiryDate || null;

  /* ================= DAYS LEFT LOGIC ================= */
  let daysLeft = null;
  let daysLeftText = "Unlimited access";
  let isExpiringSoon = false;

  if (expiryDate) {
    const now = Date.now();
    const diff = expiryDate - now;

    daysLeft = Math.max(
      0,
      Math.ceil(diff / (24 * 60 * 60 * 1000))
    );

    if (daysLeft === 0) {
      daysLeftText = "Plan expired";
    } else {
      daysLeftText = `Your plan ends in ${daysLeft} day${
        daysLeft > 1 ? "s" : ""
      }`;
    }

    if (daysLeft <= 7) {
      isExpiringSoon = true;
    }
  }

  /* ================= UPGRADE VISIBILITY ================= */
  const activePlans = plans.filter((p) => p.isActive);
  const highestPlan =
    activePlans.length > 0
      ? activePlans[activePlans.length - 1]
      : null;

  const showUpgrade =
    highestPlan &&
    activePlanId !== highestPlan.id;

  /* ================= OUTSIDE CLICK CLOSE ================= */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open]);

  /* ================= ACTIONS ================= */

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
      const updatedUser = {
        ...authUser,
        avatar: reader.result,
      };

      localStorage.setItem(
        "auth_user",
        JSON.stringify(updatedUser)
      );

      window.location.reload();
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <div style={bar}>
        {/* LEFT */}
        <div style={left}>
          <div style={title}>Trading Journal</div>

          {/* PLAN INFO */}
          <div style={planWrap}>
            <span style={planLabel}>
              Current Plan:
            </span>

            <span style={planBadge}>
              {activePlanName}
            </span>

            <span
              style={{
                ...planDays,
                fontWeight: "600",
                ...(isExpiringSoon
                  ? expiringGlow
                  : {}),
              }}
            >
              {isExpiringSoon && "⚠️ "}
              {daysLeftText}
            </span>

            {showUpgrade && (
              <button
                style={upgradeBtn}
                onClick={() => navigate("/upgrade")}
              >
                Upgrade to unlock new features
              </button>
            )}
          </div>
        </div>

        {/* RIGHT USER */}
        <div
          style={{ position: "relative" }}
          ref={dropdownRef}
        >
          <div
            style={profile}
            onClick={() => setOpen(!open)}
          >
            <div style={avatar}>
              {authUser.avatar ? (
                <img
                  src={authUser.avatar}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                (authUser.name ||
                  authUser.email)[0].toUpperCase()
              )}
            </div>

            <span style={name}>{authUser.name}</span>
          </div>

          {open && (
            <div style={dropdown}>
              <div style={userInfo}>
                <strong>{authUser.name}</strong>
                <div style={email}>
                  {authUser.email}
                </div>
              </div>

              <div
                style={item}
                onClick={() =>
                  fileRef.current.click()
                }
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

              <div
                style={logout}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal
          onClose={() =>
            setShowChangePassword(false)
          }
        />
      )}
    </>
  );
}

/* ================= STYLES (UNCHANGED + WARNING GLOW) ================= */

const bar = {
  height: "60px",
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
};

const left = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const title = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#0f172a",
};

const planWrap = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const planLabel = {
  fontSize: "13px",
  color: "#475569",
};

const planBadge = {
  padding: "4px 12px",
  borderRadius: "20px",
  background: "#4f46e5",
  color: "#fff",
  fontSize: "12px",
  fontWeight: 600,
  boxShadow:
    "0 0 10px rgba(79,70,229,0.6)",
};

const planDays = {
  fontSize: "14px",
  color: "#475569",
};

const expiringGlow = {
  color: "#b91c1c",
  textShadow: "0 0 8px rgba(185,28,28,0.6)",
};

const upgradeBtn = {
  padding: "6px 14px",
  borderRadius: "20px",
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
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
