/**
 * Convert a seconds offset (e.g., 7200) into "GMT+02:00".
 */
function toGmtOffsetLabel(seconds) {
  if (seconds === undefined || seconds === null) return null;
  const sign = seconds >= 0 ? "+" : "-";
  const abs = Math.abs(seconds);
  const hours = String(Math.floor(abs / 3600)).padStart(2, "0");
  const mins = String(Math.floor((abs % 3600) / 60)).padStart(2, "0");
  return `GMT${sign}${hours}:${mins}`;
}

/**
 * Compute current local time string using a seconds offset from UTC.
 */
function nowAtOffset(seconds) {
  if (seconds === undefined || seconds === null) return null;
  const nowUtc = new Date();
  const ms = nowUtc.getTime() + seconds * 1000;
  return new Date(ms).toISOString();
}

module.exports = { toGmtOffsetLabel, nowAtOffset };
