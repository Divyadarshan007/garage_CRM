const Admin = require("../models/Admin.model");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const loginAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                isActive: true,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        next(error);
    }
};

const getAdminProfile = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.admin._id);

        if (admin) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                isActive: true
            });
        } else {
            res.status(404);
            throw new Error("Admin not found");
        }
    } catch (error) {
        next(error);
    }
};

const createAdmin = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            res.status(400);
            throw new Error("Admin already exists");
        }

        const admin = await Admin.create({
            name,
            email,
            password,
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
            });
        } else {
            res.status(400);
            throw new Error("Invalid admin data");
        }
    } catch (error) {
        next(error);
    }
};

const updateAdmin = async (req, res, next) => {
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
                _id: updatedAdmin._id,
                name: updatedAdmin.name,
                email: updatedAdmin.email,
            });
        } else {
            res.status(404);
            throw new Error("Admin not found");
        }
    } catch (error) {
        next(error);
    }
};

const deleteAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (admin) {
            await Admin.deleteOne({ _id: req.params.id });
            res.json({ id: req.params.id });
        } else {
            res.status(404);
            throw new Error("Admin not found");
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginAdmin,
    getAdminProfile,
    createAdmin,
    updateAdmin,
    deleteAdmin,
};
