/**
 * Generate a unique tracking ID for complaints.
 * Format: JS-YYYYMMDD-XXXX
 * Example: JS-20260312-4752
 */
export function generateTrackingId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const random = String(Math.floor(1000 + Math.random() * 9000)); // 4-digit random
    return `JS-${year}${month}${day}-${random}`;
}
