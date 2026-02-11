const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin.model");
const { loginAdmin, getAdminProfile } = require("../controllers/admin.controller");
const { protect } = require("../utils/authMiddleware");

router.get("/", async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.post("/auth/login", loginAdmin);
router.get("/auth/profile", protect, getAdminProfile);
router.post("/auth/logout", (req, res) => {
    res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;