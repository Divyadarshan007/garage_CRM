const express = require("express");
const router = express.Router();
const { loginGarage, getGarageProfile } = require("../controllers/garageAuth.controller");
const { protectGarage } = require("../utils/garageAuthMiddleware");

router.post("/login", loginGarage);
router.post("/logout", (req, res) => {
    res.status(200).json({ success: true, message: "Logged out successfully" });
});
router.get("/profile", protectGarage, getGarageProfile);

module.exports = router;
