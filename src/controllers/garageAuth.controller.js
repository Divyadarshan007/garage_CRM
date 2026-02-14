const Garage = require("../models/Garage.model");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id, role: "garage" }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const loginGarage = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        const garage = await Garage.findOne({ email, isDeleted: false });

        if (garage && (await garage.matchPassword(password))) {
            res.json({
                success: true,
                message: "Login successful",
                data: {
                    garage: {
                        _id: garage._id,
                        name: garage.name,
                        owner: garage.owner,
                        email: garage.email,
                        mobile: garage.mobile,
                    },
                    token: generateToken(garage._id),
                },
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getGarageProfile = async (req, res) => {
    try {
        const garage = await Garage.findById(req.garage._id).select("-password");

        if (garage) {
            res.json({
                success: true,
                data: {
                    garage: {
                        _id: garage._id,
                        name: garage.name,
                        owner: garage.owner,
                        email: garage.email,
                        mobile: garage.mobile,
                        address: garage.address,
                    }
                }
            });
        } else {
            res.status(404).json({ success: false, message: "Garage not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    loginGarage,
    getGarageProfile,
};
