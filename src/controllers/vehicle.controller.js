const VehicleModel = require("../models/Vehicle.model");
const JobCardModel = require("../models/JobCard.model");
const { getPaginationParams } = require("../utils/pagination.helper");

const createVehicle = async (req, res, next) => {
    try {
        const { customerId, garageId, vehicleType, brand, model, vehicleNumber, fuelType, isDeleted } = req.body;
        const vehicle = new VehicleModel({ customerId, garageId, vehicleType, brand, model, vehicleNumber, fuelType, isDeleted });
        await vehicle.save();
        res.status(200).json(vehicle);
    } catch (error) {
        next(error);
    }
};

const getVehiclesByCustomer = async (req, res, next) => {
    try {
        const { id, pageId } = req.params;
        const page = Math.max(parseInt(pageId) || 1, 1);
        const limit = 10;
        const skip = (page - 1) * limit;
        const garageId = req.garage._id;

        const [vehicles, total] = await Promise.all([
            VehicleModel.find({ customerId: id, garageId, isDeleted: { $ne: true } })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            VehicleModel.countDocuments({ customerId: id, garageId, isDeleted: { $ne: true } })
        ]);

        res.status(200).json(vehicles);
    } catch (error) {
        next(error);
    }
};
const getAllVehicles = async (req, res, next) => {
    try {
        const { page: queryPage, limit: queryLimit, search, sortBy, sortOrder } = getPaginationParams(req);

        // Handle params pagination if present
        let page = queryPage;
        let limit = queryLimit;

        if (req.params.pageId) {
            page = Math.max(parseInt(req.params.pageId) || 1, 1);
            // Re-calculate skip if page is from params
            // skip = (page - 1) * limit; // logic handles this below or we need to ensure skip is correct
        }
        const skip = (page - 1) * limit;

        // Filter by the logged-in garage
        const garageId = req.garage._id;
        let searchQuery = { garageId };

        if (search) {
            searchQuery.$or = [
                { brand: { $regex: search, $options: "i" } },
                { model: { $regex: search, $options: "i" } },
                { vehicleNumber: { $regex: search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            VehicleModel.find(searchQuery)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            VehicleModel.countDocuments(searchQuery)
        ]);

        res.status(200).json(
            data
            // pagination: buildPaginationMeta(total, page, limit)
        );
    } catch (error) {
        next(error);
    }
}


const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await VehicleModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(vehicle);
    } catch (error) {
        next(error);
    }
}

const deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await VehicleModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(vehicle);
    } catch (error) {
        next(error);
    }
}

const getVehicleDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const garageId = req.garage._id;

        const vehicle = await VehicleModel.findOne({ _id: id, garageId }).populate("customerId");

        if (!vehicle) {
            const error = new Error("Vehicle not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(vehicle);
    } catch (error) {
        next(error);
    }
};

const getVehicleJobCards = async (req, res, next) => {
    try {
        const { id, pageId } = req.params;
        const page = Math.max(parseInt(pageId) || 1, 1);
        const limit = 10;
        const skip = (page - 1) * limit;
        const garageId = req.garage._id;

        const [jobCards, total] = await Promise.all([
            JobCardModel.find({ vehicleId: id, garageId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            JobCardModel.countDocuments({ vehicleId: id, garageId })
        ]);

        res.status(200).json(jobCards);
    } catch (error) {
        next(error);
    }
};

module.exports = { createVehicle, getAllVehicles, updateVehicle, deleteVehicle, getVehiclesByCustomer, getVehicleDetail, getVehicleJobCards };