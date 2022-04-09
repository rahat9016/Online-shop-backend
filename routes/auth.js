const express = require("express");
const { createOrUpdateUser, currentUser } = require("../controller/auth");
const router = express.Router();
const { authCheck, adminCheck } = require("../middleware/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;
