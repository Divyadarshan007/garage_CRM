const Admin = require("../models/Admin.model");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "30d",
    });
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                success: true,
                message: "Login successful",
                data: {
                    admin: {
                        _id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        isActive: true
                    },
                    token: generateToken(admin._id),
                },
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);

        if (admin) {
            res.json({
                success: true,
                data: {
                    admin: {
                        _id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        isActive: true
                    }
                }
            });
        } else {
            res.status(404).json({ success: false, message: "Admin not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    loginAdmin,
    getAdminProfile,
};
