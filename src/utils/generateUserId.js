export function generateUserId() {
  const last = Number(
    localStorage.getItem("last_user_number") || "1000"
  );

  const next = last + 1;

  localStorage.setItem("last_user_number", next);

  return `U${next}`;
}
