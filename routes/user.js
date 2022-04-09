const express = require("express");
const router = express.Router();

router.get("/user", (req, res, next) => {
  res.status(200).json({
    message: "OK",
  });
});

module.exports = router;
