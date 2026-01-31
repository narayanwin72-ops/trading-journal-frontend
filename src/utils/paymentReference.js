export function buildPaymentReference(userId, planCode, durationCode) {
  return `CF-${userId}-${planCode}-${durationCode}`;
}
