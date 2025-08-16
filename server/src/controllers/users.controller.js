const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser: repoUpdateUser,
  deleteUser,
} = require("../repositories/users.repo");
const { fetchLocationByZip } = require("../services/openweather.service");

/**
 * Validate minimal payload fields for create/update.
 */
function assertCreatePayload(body) {
  const { name, zipCode } = body || {};
  if (!name || !zipCode) {
    const missing = !name ? "name" : "zipCode";
    const err = new Error(`"${missing}" is required`);
    err.status = 400;
    throw err;
  }
}

async function postUser(req, res, next) {
  try {
    assertCreatePayload(req.body);

    const { name, zipCode } = req.body;
    const loc = await fetchLocationByZip(zipCode);

    const user = await createUser({
      name,
      zipCode,
      latitude: loc.latitude,
      longitude: loc.longitude,
      timezone: loc.timezone,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function listUsers(_req, res, next) {
  try {
    const users = await getAllUsers();
    res.json(users || []);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function putUser(req, res, next) {
  try {
    const id = req.params.id;
    const current = await getUserById(id);
    if (!current) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name, zipCode } = req.body || {};
    let patch = {};
    if (name) patch.name = name;

    if (zipCode && zipCode !== current.zipCode) {
      const loc = await fetchLocationByZip(zipCode);
      patch = {
        ...patch,
        zipCode,
        latitude: loc.latitude,
        longitude: loc.longitude,
        timezone: loc.timezone,
      };
    }

    const updated = await repoUpdateUser(
      id,
      Object.keys(patch).length ? patch : current
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function removeUser(req, res, next) {
  try {
    const ok = await deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postUser,
  listUsers,
  getUser,
  putUser,
  removeUser,
};
