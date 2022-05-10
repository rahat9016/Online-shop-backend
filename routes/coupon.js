const express = require("express");
const { create, read, remove } = require("../controller/coupon");
const { authCheck, adminCheck } = require("../middleware/auth");
const router = express.Router();

router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", read);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);
module.exports = router;
