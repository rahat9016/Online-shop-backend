const express = require("express");
const { orders, orderStatus } = require("../controller/admin");
const { authCheck, adminCheck } = require("../middleware/auth");
const router = express.Router();

router.get("/admin/orders", authCheck, adminCheck, orders);
router.put("/admin/order-status", authCheck, adminCheck, orderStatus);

module.exports = router;
