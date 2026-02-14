const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin.model");
const { loginAdmin, getAdminProfile, createAdmin, updateAdmin, deleteAdmin } = require("../controllers/admin.controller");
const { protect } = require("../utils/authMiddleware");

router.post("/auth/login", loginAdmin);
router.post("/auth/logout", (req, res) => {
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.get("/", protect, async (req, res) => {
    try {
        const admins = await Admin.find().sort({ createdAt: -1 }).select("-password");
        res.status(200).json({ message: "Admins fetched successfully", admins });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", protect, createAdmin);
router.put("/:id", protect, updateAdmin);
router.delete("/:id", protect, deleteAdmin);
router.get("/auth/profile", protect, getAdminProfile);

module.exports = router;