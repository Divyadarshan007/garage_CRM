const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin.model");
const { loginAdmin, getAdminProfile, createAdmin, updateAdmin, deleteAdmin } = require("../controllers/admin.controller");
const { protect } = require("../utils/authMiddleware");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination.helper");
const { validate } = require("../middleware/validator");
const { createAdminSchema, loginAdminSchema, updateAdminSchema } = require("../validators/admin.validator");

router.post("/login", validate(loginAdminSchema), loginAdmin);
router.post("/auth/logout", (req, res) => {
    res.status(200).json({ loggedOut: true });
});

router.get("/", protect, async (req, res, next) => {
    try {
        const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req);

        let searchQuery = {};
        if (search) {
            searchQuery = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ]
            };
        }

        const [data, total] = await Promise.all([
            Admin.find(searchQuery)
                .select("-password")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Admin.countDocuments(searchQuery)
        ]);

        res.status(200).json({
            data,
            pagination: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        next(error);
    }
});

router.post("/", protect, validate(createAdminSchema), createAdmin);
router.put("/:id", protect, validate(updateAdminSchema), updateAdmin);
router.delete("/:id", protect, deleteAdmin);
router.get("/auth/profile", protect, getAdminProfile);

module.exports = router;