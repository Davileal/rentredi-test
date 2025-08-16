const router = require("express").Router();
const ctrl = require("../controllers/users.controller");

router.post("/", ctrl.postUser);
router.get("/", ctrl.listUsers);
router.get("/:id", ctrl.getUser);
router.put("/:id", ctrl.putUser);
router.delete("/:id", ctrl.removeUser);

module.exports = router;
