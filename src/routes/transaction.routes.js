const express = require("express");
const router = express.Router();
const { protectGarage } = require("../utils/garageAuthMiddleware");

router.use(protectGarage);

router.post("/", (req, res) => {
    res.send("Transaction created");
});

module.exports = router;