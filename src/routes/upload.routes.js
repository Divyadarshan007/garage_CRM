const express = require("express");
const router = express.Router();
const upload = require("../utils/middlewares/multer");
const path = require("path");
router.post("/", upload.array("images", 10), async (req, res) => {
    const files = req.files;
    const filePaths = files.map((file) => file.path.replace(/\\/g, "/"));
    res.json({ filePaths });
});

module.exports = router;