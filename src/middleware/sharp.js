const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const imagesDir = path.join(__dirname, "../../images");

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filename = `${req.file.originalname.split(" ").join("_").split(".")[0]}_${Date.now()}.webp`;

    await sharp(req.file.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .webp({ quality: 80 })
      .toFile(path.join(imagesDir, filename));

    req.file.filename = filename;
    next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};