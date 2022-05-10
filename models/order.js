const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Cash on Delivery",
        "Processing",
        "Dispatched",
        "Canceled",
        "Completed",
      ],
    },
    orderedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);
