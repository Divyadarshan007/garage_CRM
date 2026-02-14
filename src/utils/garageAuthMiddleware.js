const jwt = require("jsonwebtoken");
const Garage = require("../models/Garage.model");

/**
 * Garage Authentication Middleware
 * Verifies JWT token from Authorization header and checks garage exists in DB
 */
const protectGarage = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
        }

        // Ensure this is a garage token, not an admin token
        if (decoded.role !== "garage") {
            return res.status(401).json({ success: false, message: "Not authorized, invalid token type" });
        }

        // Check if garage exists in DB
        Garage.findById(decoded.id)
            .select("-password")
            .lean()
            .then((garage) => {
                if (!garage) {
                    return res.status(401).json({ success: false, message: "Not authorized, garage not found" });
                }

                if (garage.isDeleted) {
                    return res.status(401).json({ success: false, message: "Not authorized, garage has been deactivated" });
                }

                // Attach garage to request for use in routes
                req.garage = garage;
                next();
            })
            .catch((err) => {
                console.error("Garage auth middleware error:", err);
                return res.status(401).json({ success: false, message: "Not authorized, authentication error" });
            });
    });
};

module.exports = { protectGarage };
