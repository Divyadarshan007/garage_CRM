const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.model");

/**
 * Admin Authentication Middleware
 * Verifies JWT token from Authorization header and checks admin exists in DB
 * Pattern: Same as yaaro_backend authenticateAdminToken
 */
const protect = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
        }

        // Check if admin exists in DB
        Admin.findById(decoded.id)
            .select("-password")
            .lean()
            .then((admin) => {
                if (!admin) {
                    return res.status(401).json({ success: false, message: "Not authorized, admin not found" });
                }

                // Attach admin to request for use in routes
                req.admin = admin;
                next();
            })
            .catch((err) => {
                console.error("Auth middleware error:", err);
                return res.status(401).json({ success: false, message: "Not authorized, authentication error" });
            });
    });
};

module.exports = { protect };
