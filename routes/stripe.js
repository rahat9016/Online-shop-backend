const express = require("express");
const { createPaymentIntent } = require("../controller/stripe");
const { authCheck } = require("../middleware/auth");
const router = express.Router();

router.post("/create-payment-intent", authCheck, createPaymentIntent);

module.exports = router;
