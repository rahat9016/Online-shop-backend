const express = require("express");
const { create, list, read, remove, update } = require("../controller/sub");
const router = express.Router();

const { adminCheck, authCheck } = require("../middleware/auth");
router.post("/sub", authCheck, adminCheck, create);
router.get("/subs", list);
router.get("/sub/:slug", read);
router.put("/sub/:slug", authCheck, adminCheck, update);
router.delete("/sub/:slug", authCheck, adminCheck, remove);
module.exports = router;
