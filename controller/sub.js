const Sub = require("../models/sub");
const slugify = require("slugify");
const Product = require("../models/product");

// Sub Create
exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;

    const sub = await new Sub({
      name,
      slug: slugify(name),
      parent: parent,
    }).save();
    res.status(200).json(sub);
  } catch (error) {
    console.log("Sub create error ----->", error);
    res.status(400).send("Create Sub failed");
  }
};

// Sub Get ALL Item
exports.list = async (req, res) => {
  try {
    const SubList = await Sub.find({}).sort({ createAt: -1 }).exec();
    res.status(200).json(SubList);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error });
  }
};
// Sub Read by Params ID
exports.read = async (req, res) => {
  const params = req.params.slug;
  try {
    const sub = await Sub.findOne({ slug: params }).exec();

    const products = await Product.find({ subs: sub })
      .populate("category")
      .exec();
    res.status(200).json({ sub, products });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

//Sub Item Update
exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

// Sub Deleted by Params ID
exports.remove = async (req, res) => {
  const params = req.params.slug;
  try {
    const deleted = await Sub.findOneAndDelete({ slug: params });
    res.status(200).send(deleted);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
