export function formatTzOffset(seconds) {
  if (seconds === undefined || seconds === null) return "-";
  const sign = seconds >= 0 ? "+" : "-";
  const abs = Math.abs(seconds);
  const hours = String(Math.floor(abs / 3600)).padStart(2, "0");
  const mins = String(Math.floor((abs % 3600) / 60)).padStart(2, "0");
  return `GMT${sign}${hours}:${mins}`;
}

export function mapLink(lat, lon) {
  if (lat == null || lon == null) return null;
  const z = 11; // zoom
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${z}/${lat}/${lon}`;
}
