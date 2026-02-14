const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin.model");
const { loginAdmin, getAdminProfile, createAdmin, updateAdmin, deleteAdmin } = require("../controllers/admin.controller");
const { protect } = require("../utils/authMiddleware");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination.helper");

router.post("/auth/login", loginAdmin);
router.post("/auth/logout", (req, res) => {
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.get("/", protect, async (req, res) => {
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
            message: "Admins fetched successfully",
            data,
            pagination: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", protect, createAdmin);
router.put("/:id", protect, updateAdmin);
router.delete("/:id", protect, deleteAdmin);
router.get("/auth/profile", protect, getAdminProfile);

module.exports = router;