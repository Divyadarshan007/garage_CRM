const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");
const upload = require("../utils/middlewares/multer");
// const { validate } = require("../middleware/validator");
// const { uploadSchema, deleteFileSchema } = require("../validators/upload.validator");
const path = require("path");

router.use(protectGarage);

// File upload does not need body validation, handled by multer
// But we wrap the handler for consistency or future expansion
router.post("/", upload.array("images", 10), async (req, res, next) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        // Normalize paths
        const filePaths = files.map((file) => file.path.replace(/\\/g, "/"));
        res.status(200).json(filePaths);
    } catch (error) {
        next(error);
    }
});

// Example for delete if implemented
// router.delete("/", validate(deleteFileSchema), deleteFileController);

module.exports = router;