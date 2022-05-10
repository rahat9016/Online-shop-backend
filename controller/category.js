const Category = require("../models/category");
const Sub = require("../models/sub");
const Product = require("../models/product");
const slugify = require("slugify");

// Category Create
exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).send("Create category failed");
  }
};

// Category Get ALL Item
exports.list = async (req, res) => {
  try {
    const categoryList = await Category.find({}).sort({ createAt: -1 }).exec();
    res.status(200).json(categoryList);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error });
  }
};
// Category Read by Params ID
exports.read = async (req, res) => {
  const params = req.params.slug;
  try {
    const category = await Category.findOne({ slug: params }).exec();
    const products = await Product.find({ category })
      .populate("category")
      .exec();
    res.json({
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

//Category Item Update
exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

// Category Deleted by Params ID
exports.remove = async (req, res) => {
  const params = req.params.slug;
  try {
    const deleted = await Category.findOneAndDelete({ slug: params });
    res.status(200).send(deleted);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
exports.getSubs = async (req, res) => {
  Sub.find({ parent: req.params._id }).exec((error, subs) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json(subs);
    }
  });
};
