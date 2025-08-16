const { db } = require("../config/firebase");

const COLLECTION = "users";

async function createUser(user) {
  const ref = db().ref(COLLECTION).push();
  const doc = { ...user, id: ref.key };
  await ref.set(doc);
  return doc;
}

async function getAllUsers() {
  const snap = await db().ref(COLLECTION).once("value");
  const val = snap.val() || {};
  return Object.values(val);
}

async function getUserById(id) {
  const snap = await db().ref(`${COLLECTION}/${id}`).once("value");
  return snap.exists() ? snap.val() : null;
}

async function updateUser(id, partial) {
  const ref = db().ref(`${COLLECTION}/${id}`);
  const snap = await ref.once("value");
  if (!snap.exists()) return null;
  const merged = { ...snap.val(), ...partial };
  await ref.set(merged);
  return merged;
}

async function deleteUser(id) {
  const ref = db().ref(`${COLLECTION}/${id}`);
  const snap = await ref.once("value");
  if (!snap.exists()) return false;
  await ref.remove();
  return true;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
