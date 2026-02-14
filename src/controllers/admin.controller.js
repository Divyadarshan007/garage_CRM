const Admin = require("../models/Admin.model");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
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
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    isActive: true,
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
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    isActive: true
                }
            });
        } else {
            res.status(404).json({ success: false, message: "Admin not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ success: false, message: "Admin already exists" });
        }

        const admin = await Admin.create({
            name,
            email,
            password,
        });

        if (admin) {
            res.status(201).json({
                success: true,
                message: "Admin created successfully",
                admin: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                },
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid admin data" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (admin) {
            admin.name = req.body.name || admin.name;
            admin.email = req.body.email || admin.email;

            if (req.body.password) {
                admin.password = req.body.password;
            }

            const updatedAdmin = await admin.save();

            res.json({
                success: true,
                message: "Admin updated successfully",
                admin: {
                    _id: updatedAdmin._id,
                    name: updatedAdmin.name,
                    email: updatedAdmin.email,
                },
            });
        } else {
            res.status(404).json({ success: false, message: "Admin not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (admin) {
            await Admin.deleteOne({ _id: req.params.id });
            res.json({ success: true, message: "Admin removed" });
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
    createAdmin,
    updateAdmin,
    deleteAdmin,
};
