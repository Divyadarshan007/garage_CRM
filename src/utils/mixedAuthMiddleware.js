const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.model");
const Garage = require("../models/Garage.model");

/**
 * Mixed Authentication Middleware
 * Allows both Admin and Garage roles.
 * For Garage roles, it checks if they are accessing their own resource.
 */
const protectAdminOrGarage = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
        }

        if (decoded.role === "admin") {
            // Admin can access everything
            Admin.findById(decoded.id)
                .select("-password")
                .lean()
                .then((admin) => {
                    if (!admin) {
                        return res.status(401).json({ success: false, message: "Not authorized, admin not found" });
                    }
                    req.admin = admin;
                    req.userRole = "admin";
                    next();
                })
                .catch((err) => {
                    console.error("Mixed auth middleware (admin) error:", err);
                    return res.status(401).json({ success: false, message: "Not authorized, authentication error" });
                });
        } else if (decoded.role === "garage") {
            Garage.findById(decoded.id)
                .select("-password")
                .lean()
                .then((garage) => {
                    if (!garage) {
                        return res.status(401).json({ success: false, message: "Not authorized, garage not found" });
                    }
                    if (garage.isDeleted) {
                        return res.status(401).json({ success: false, message: "Not authorized, garage deactivated" });
                    }
                    req.garage = garage;
                    req.userRole = "garage";
                    next();
                })
                .catch((err) => {
                    console.error("Mixed auth middleware (garage) error:", err);
                    return res.status(401).json({ success: false, message: "Not authorized, authentication error" });
                });
        } else {
            return res.status(401).json({ success: false, message: "Not authorized, invalid token type" });
        }
    });
};

module.exports = { protectAdminOrGarage };
