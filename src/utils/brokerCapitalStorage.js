/* =====================================================
   USER-WISE BROKER CAPITAL STORAGE (FINAL FIX)
===================================================== */

/* 🔑 CURRENT USER */
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user"));
  } catch {
    return null;
  }
}

/* 🔑 USER-SPECIFIC STORAGE KEY */
function getKey() {
  const user = getCurrentUser();

  // 🔥 CRITICAL FIX
  // ❌ user.user_id (WRONG)
  // ✅ user.id (CORRECT – used everywhere in your app)
  return user && user.id
    ? `user_broker_capital_${user.id}`
    : null;
}

/* ================= LOAD ================= */
export function loadBrokerCapital() {
  const key = getKey();
  if (!key) return [];

  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

/* ================= SAVE ================= */
export function saveBrokerCapital(data) {
  const key = getKey();
  if (!key) return;

  // always save array
  localStorage.setItem(
    key,
    JSON.stringify(Array.isArray(data) ? data : [])
  );
}
