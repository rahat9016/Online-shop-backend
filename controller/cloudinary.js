const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

exports.upload = async (req, res, next) => {
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: "auto",
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};
exports.removeImage = async (req, res, next) => {
  let image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error) {
      return res.json({ success: false, error });
    }
    res.send("ok");
  });
};
