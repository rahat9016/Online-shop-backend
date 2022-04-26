const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

// --------[ Comment Box]-------------
//<<<<<<<<< Create product >>>>>>>
// --------[Comment Box]--------------
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
// --------[ Comment Box]-------------
//<<<<<<<<< List all by count >>>>>>>
// --------[Comment Box]--------------
exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};
// --------[ Comment Box]-------------
//<<<<<<<<< Remove Product >>>>>>>
// --------[Comment Box]--------------
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
// --------[ Comment Box]-------------
//<<<<<<<<< Read >>>>>>>
// --------[Comment Box]--------------
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
// --------[ Comment Box]-------------
//<<<<<<<<< Update >>>>>>>
// --------[Comment Box]--------------
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
// --------[ Comment Box]-------------
//<<<<<<<<< Without pagination >>>>>>>
// --------[Comment Box]--------------

// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     res.json(products);
//   } catch (error) {}
// };

// --------[ Comment Box]-------------
//<<<<<<<<< With pagination >>>>>>>
// --------[Comment Box]--------------
exports.list = async (req, res) => {
  console.table(req.body);
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (error) {}
};
// --------[ Comment Box]-------------
//<<<<<<<<< Total products >>>>>>>
// --------[Comment Box]--------------
exports.totalProduct = async (req, res) => {
  const total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

// --------[ Comment Box]-------------
//<<<<<<<<< Product Star >>>>>>>
// --------[Comment Box]--------------
exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();

  const { star } = req.body;
  console.table(star);
  let existingRatingObject = product.ratings.find(
    (ele) => ele.postBy.toString() === user._id.toString()
  );
  if (existingRatingObject === undefined) {
    //if user haven't left rating yet, push it
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postBy: user._id } },
      },
      { new: true }
    ).exec();
    console.log("Ratting added", ratingAdded);
    res.json(ratingAdded);
  } else {
    //if user have already left rating, update it
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: existingRatingObject } },
      {
        $set: { "ratings.$.star": star },
      },
      { new: true }
    ).exec();
    console.log("Ratting updated", ratingUpdated);
    res.json(ratingUpdated);
  }
};

// --------[ Comment Box]-------------
//<<<<<<<<< Main Product with Related product >>>>>>>
// --------[Comment Box]--------------

exports.relatedProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .exec();
  res.json(related);
};

// --------[ Comment Box]-------------
//<<<<<<<<< Search Filters >>>>>>>
// --------[Comment Box]--------------
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();
  res.status(200).json(products);
};
// ......................................
exports.searchFilters = async (req, res) => {
  const { query } = req.body;
  if (query) {
    await handleQuery(req, res, query);
  }
};
