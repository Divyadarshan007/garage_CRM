const express = require("express");
const router = express.Router();
const { protect } = require("../utils/authMiddleware");

router.use(protect);

router.post("/", (req, res) => {
    res.send("Transaction created");
});

module.exports = router;