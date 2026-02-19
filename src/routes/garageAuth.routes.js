const express = require("express");
const router = express.Router();
const { loginGarage, firebaseLogin, getGarageProfile } = require("../controllers/garageAuth.controller");
const { protectGarage } = require("../utils/garageAuthMiddleware");
const { validate } = require("../middleware/validator");
const { loginSchema, firebaseLoginSchema } = require("../validators/auth.validator");
const path = require("path");

router.post("/login", validate(loginSchema), loginGarage);
router.post("/firebase-login", validate(firebaseLoginSchema), firebaseLogin);
router.get("/test-token", (req, res) => {
    res.sendFile(path.join(__dirname, "../../firebase_token_helper.html"));
});
router.post("/logout", (req, res) => {
    res.status(200).json({ success: true, message: "Logged out successfully" });
});
router.get("/profile", protectGarage, getGarageProfile);

module.exports = router;
