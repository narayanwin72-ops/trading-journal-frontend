/* ================= USER-AWARE SETTINGS STORAGE ================= */

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user"));
  } catch {
    return null;
  }
}

function getKey() {
  const user = getCurrentUser();

  // 🔥 FIX: user.id (NOT user.user_id)
  return user && user.id ? `user_settings_${user.id}` : null;
}

export function loadSettings() {
  const key = getKey();
  if (!key) return {};

  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    localStorage.removeItem(key);
    return {};
  }
}

export function saveSettings(data) {
  const key = getKey();
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(data));
}
