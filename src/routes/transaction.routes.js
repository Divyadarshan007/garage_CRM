const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    res.send("Transaction created");
});

module.exports = router;