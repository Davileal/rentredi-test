const router = require("express").Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/ready", (_req, res) => {
  res.json({ ready: true });
});

module.exports = router;
