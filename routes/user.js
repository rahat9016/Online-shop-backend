const express = require("express");
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  removeFromWishlist,
  wishlist,
  addToWishlist,
  createCashOrder,
} = require("../controller/user");
const { authCheck } = require("../middleware/auth");
const router = express.Router();

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);

//User Order Router
router.post("/user/order", authCheck, createOrder);
router.post("/user/cash-order", authCheck, createCashOrder);
router.get("/user/orders", authCheck, orders);

//Wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

//Coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);
module.exports = router;
