const Coupon = require("../models/coupon");

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon;
    res.json(await Coupon({ name, expiry, discount }).save());
  } catch (error) {
    console.log(error);
  }
};
exports.read = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ createAt: -1 }).exec());
  } catch (error) {
    console.log(error);
  }
};
exports.remove = async (req, res) => {
  try {
    res.json(await Coupon.findOneAndDelete(req.params.couponId).exec());
  } catch (error) {
    console.log(error);
  }
};
