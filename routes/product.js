const express = require("express");
const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  totalProduct,
} = require("../controller/product");
const { authCheck, adminCheck } = require("../middleware/auth");
const router = express.Router();

router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", totalProduct);
router.get("/products/:count", listAll);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);
router.post("/products", list);
module.exports = router;
