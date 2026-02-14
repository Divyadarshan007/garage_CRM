const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const upload = require("../utils/middlewares/multer");
const path = require("path");

router.use(protectGarage);

router.post("/", upload.array("images", 10), async (req, res) => {
    const files = req.files;
    const filePaths = files.map((file) => file.path.replace(/\\/g, "/"));
    res.status(200).json({ message: "Files uploaded successfully", filePaths });
});

module.exports = router;