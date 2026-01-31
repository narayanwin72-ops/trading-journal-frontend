function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user"));
  } catch {
    return null;
  }
}

function getKey() {
  const user = getCurrentUser();
  return user ? `user_dashboard_${user.user_id}` : null;
}

export function loadDashboard() {
  const key = getKey();
  if (!key) return {};

  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    localStorage.removeItem(key);
    return {};
  }
}

export function saveDashboard(data) {
  const key = getKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(data));
}
