require("dotenv").config();

const PORT = process.env.PORT || 8080;
const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL;
const OPENWEATHER_API_KEY =
  process.env.OPENWEATHER_API_KEY || "7afa46f2e91768e7eeeb9001ce40de19";

if (!FIREBASE_DB_URL) {
  console.warn(
    "[env] FIREBASE_DB_URL is not set. Please configure your Firebase RTDB URL."
  );
}

module.exports = {
  PORT,
  FIREBASE_DB_URL,
  OPENWEATHER_API_KEY,
};
