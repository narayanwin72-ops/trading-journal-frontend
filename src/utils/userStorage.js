export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user"));
  } catch {
    return null;
  }
}

export function getUserData() {
  const user = getCurrentUser();
  if (!user || !user.id) return null;

  const key = `user_data_${user.id}`; // 🔥 FIX
  return (
    JSON.parse(localStorage.getItem(key)) || {
      trades: [],
      dashboard: {},
      kpis: {},
      settings: {},
    }
  );
}

export function saveUserData(data) {
  const user = getCurrentUser();
  if (!user || !user.id) return;

  const key = `user_data_${user.id}`; // 🔥 FIX
  localStorage.setItem(key, JSON.stringify(data));
}
