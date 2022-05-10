const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const uniqueid = require("uniqueid");
exports.userCart = async (req, res) => {
  const { cart } = req.body;

  let products = [];

  const user = await User.findOne({ email: req.user.email }).exec();
  let cartExistingThisUser = await Cart.findOne({ orderedBy: user._id }).exec();

  if (cartExistingThisUser) {
    cartExistingThisUser.remove();
    console.log("Remove old function");
  }
  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    let productFromDb = await Product.findById(cart[i]._id)
      .select("price")
      .exec();
    object.price = productFromDb.price;
    products.push(object);
  }
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }
  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();
  res.json({ ok: true });
};

//Get User cart
exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  let cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();
  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    {
      email: req.user.email,
    },
    {
      address: req.body.address,
    }
  ).exec();
  res.json({ ok: true });
};
//Coupon

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  console.log("Check Valid Coupon ----->", validCoupon);
  if (validCoupon === null) {
    res.json({ error: "Invalid Coupon!" });
  } else {
    const user = await User.findOne({ email: req.user.email }).exec();
    let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
      .populate("products.product", "_id title price")
      .exec();
    console.log("Cart Total amount ----->", cartTotal);
    // Calculate the total after discount
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    Cart.findOneAndUpdate(
      { orderedBy: user._id },
      {
        totalAfterDiscount: totalAfterDiscount,
      },
      { new: true }
    ).exec();
    res.json(totalAfterDiscount);
  }
};
//user Order by stripe

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  //Find User by req
  const user = await User.findOne({ email: req.user.email }).exec();
  const { products } = await Cart.findOne({ orderedBy: user._id }).exec();
  let newOrder = await new Order({
    paymentIntent,
    products,
    orderedBy: user._id,
  }).save();
  //decrement quantity, increment sold
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  let updated = await Product.bulkWrite(bulkOption, {});

  console.log("Product decrement and increment sold --->", updated);
  res.json({ ok: true });
};

//Order by Cash
exports.createCashOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  if (!COD) return res.status(400).send("Create cash order failed!");
  //Find User by req
  const user = await User.findOne({ email: req.user.email }).exec();

  const userCart = await Cart.findOne({ orderedBy: user._id }).exec();

  let finalAmount = 0;
  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount * 100;
  } else {
    finalAmount = userCart.cartTotal * 100;
  }
  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmount,
      currency: "usd",
      status: "Cash on Delivery",
      created: Date.now(),
      payment_method_types: ["cash"],
    },
    orderedBy: user._id,
    orderStatus: "Cash on Delivery",
  }).save();
  //decrement quantity, increment sold
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  let updated = await Product.bulkWrite(bulkOption, {});

  console.log("Product decrement and increment sold --->", newOrder);
  res.json({ ok: true });
};

//Get all orders by user

exports.orders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  let userOrders = await Order.find({ orderedBy: user._id })
    .populate("products.product")
    .exec();

  res.json(userOrders);
};

// Add to wishlist, Remove wishlist, Get wishlist

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).exec();

  res.json({ ok: true });
};
exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();
  res.json(list);
};
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};
