const VehicleModel = require("../models/Vehicle.model");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination.helper");

const createVehicle = async (req, res) => {
    try {
        const { customerId, garageId, vehicleType, brand, model, vehicleNumber, fuelType, isDeleted } = req.body;
        const vehicle = new VehicleModel({ customerId, garageId, vehicleType, brand, model, vehicleNumber, fuelType, isDeleted });
        await vehicle.save();
        res.status(200).json({ message: "Vehicle created successfully", vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAllVehicles = async (req, res) => {
    try {
        const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req);

        let searchQuery = {};
        if (search) {
            searchQuery = {
                $or: [
                    { brand: { $regex: search, $options: "i" } },
                    { model: { $regex: search, $options: "i" } },
                    { vehicleNumber: { $regex: search, $options: "i" } },
                ]
            };
        }

        const [data, total] = await Promise.all([
            VehicleModel.find(searchQuery)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            VehicleModel.countDocuments(searchQuery)
        ]);

        res.status(200).json({
            message: "Vehicles fetched successfully",
            data,
            pagination: buildPaginationMeta(total, page, limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const updateVehicle = async (req, res) => {
    try {
        const vehicle = await VehicleModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "Vehicle updated successfully", vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await VehicleModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.status(200).json({ message: "Vehicle deleted successfully", vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = { createVehicle, getAllVehicles, updateVehicle, deleteVehicle };