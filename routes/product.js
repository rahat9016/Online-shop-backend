const express = require("express");
const { create, listAll } = require("../controller/product");
const { authCheck, adminCheck } = require("../middleware/auth");
const router = express.Router();

router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll);
module.exports = router;
