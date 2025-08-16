const admin = require("firebase-admin");
const { FIREBASE_DB_URL } = require("./env");

let _db = null;

function initFirebase() {
  if (admin.apps.length) return;

  const serviceAccount = require("../../serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DB_URL,
  });

  _db = admin.database();
  console.log("Firebase RTDB initialized");
}

function db() {
  if (!_db) {
    throw new Error("Firebase not initialized. Call initFirebase() first.");
  }
  return _db;
}

module.exports = { initFirebase, db };
