const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    console.log(newProduct, "-------> new product");
    res.status(200).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};
exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};
exports.remove = async (req, res) => {
  console.log(req.params.slug);
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Product delete failed");
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    })
      .populate("category")
      .populate("subs")
      .exec();
    res.json(product);
  } catch (error) {
    res.status(400).json("Error --------->", error);
  }
};

exports.update = async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    console.log(updated);
    res.json(updated);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error.message,
    });
  }
};
