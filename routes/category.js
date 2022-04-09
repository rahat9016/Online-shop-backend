const express = require("express");
const {
  create,
  list,
  read,
  remove,
  update,
  getSubs,
} = require("../controller/category");
const router = express.Router();

const { adminCheck, authCheck } = require("../middleware/auth");
router.post("/category", authCheck, adminCheck, create);
router.get("/categories", list);
router.get("/category/:slug", read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.get("/category/subs/:_id", getSubs);
module.exports = router;
