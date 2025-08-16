const axios = require("axios");
const { OPENWEATHER_API_KEY } = require("../config/env");

async function fetchLocationByZip(zip) {
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(
    zip
  )}&appid=${OPENWEATHER_API_KEY}`;

  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    return {
      latitude: data?.coord?.lat,
      longitude: data?.coord?.lon,
      timezone: data?.timezone,
    };
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error("[OpenWeather] error:", detail);
    const message =
      typeof detail === "object"
        ? detail?.message || "OpenWeather error"
        : String(detail);
    throw new Error(`Invalid zip code or OpenWeather error: ${message}`);
  }
}

module.exports = { fetchLocationByZip };
