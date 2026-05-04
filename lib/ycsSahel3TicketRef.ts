/** Référence billet affichée type YCS3-XXXXXX */
export function formatYcsSahel3TicketRef(registrationId: string): string {
  const cleaned = registrationId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const suffix = cleaned.slice(-6).padStart(6, "0");
  return `YCS3-${suffix}`;
}
