const jwt = require("jsonwebtoken");
const Garage = require("../models/Garage.model");
const firebaseAdmin = require("../config/firebaseAdmin");

const generateToken = (id) => {
    return jwt.sign({ id, role: "garage" }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const loginGarage = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error("Please provide email and password");
        }

        const garage = await Garage.findOne({ email, isDeleted: false });

        if (garage && (await garage.matchPassword(password))) {
            const address = [garage.address?.street, garage.address?.city, garage.address?.state, garage.address?.zipCode].filter(Boolean).join(", ");
            res.json({
                token: generateToken(garage._id),
                user: {
                    _id: garage._id,
                    name: garage.name,
                    owner: garage.owner,
                    email: garage.email,
                    mobile: garage.mobile,
                    address,
                    city: garage.address?.city || "",
                    state: garage.address?.state || "",
                    zipCode: garage.address?.zipCode || "",
                }
            });
        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        next(error);
    }
};

const firebaseLogin = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            res.status(400);
            throw new Error("ID token is required");
        }

        // Verify Firebase ID Token
        const decodedToken = await firebaseAdmin.verifyIdToken(idToken);
        const { email, name, picture, uid } = decodedToken;

        // Find or create garage
        let garage = await Garage.findOne({ email, isDeleted: false });

        if (!garage) {
            // Create new garage if it doesn't exist
            garage = await Garage.create({
                email,
                name: name || "New Garage",
                owner: name || "Owner",
                password: Math.random().toString(36).slice(-8), // Dummy password
                address: {
                    street: "",
                    city: "",
                    state: "",
                    zipCode: ""
                }
            });
        }

        const address = [garage.address?.street, garage.address?.city, garage.address?.state, garage.address?.zipCode].filter(Boolean).join(", ");
        res.json({
            token: generateToken(garage._id),
            idToken, // Added for Postman convenience
            user: {
                _id: garage._id,
                name: garage.name,
                owner: garage.owner,
                email: garage.email,
                mobile: garage.mobile,
                address,
                city: garage.address?.city || "",
                state: garage.address?.state || "",
                zipCode: garage.address?.zipCode || "",
            }
        });
    } catch (error) {
        console.error("Firebase Login Error:", error);
        res.status(401);
        next(error);
    }
};

const getGarageProfile = async (req, res, next) => {
    try {
        const garage = await Garage.findById(req.garage._id).select("-password");

        if (garage) {
            const address = [garage.address?.street, garage.address?.city, garage.address?.state, garage.address?.zipCode].filter(Boolean).join(", ");
            res.json({
                _id: garage._id,
                name: garage.name,
                owner: garage.owner,
                email: garage.email,
                mobile: garage.mobile,
                address,
                city: garage.address?.city || "",
                state: garage.address?.state || "",
                zipCode: garage.address?.zipCode || "",
            });
        } else {
            res.status(404);
            throw new Error("Garage not found");
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginGarage,
    firebaseLogin,
    getGarageProfile,
};
