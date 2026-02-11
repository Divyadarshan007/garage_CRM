const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const customerRoutes = require("./src/routes/customer.routes");
const vehicleRoutes = require("./src/routes/vehicle.routes");
const jobCardRoutes = require("./src/routes/jobCard.routes");
const quotationRoutes = require("./src/routes/quotation.routes");
const invoiceRoutes = require("./src/routes/invoice.routes");
const transactionRoutes = require("./src/routes/transaction.routes");
const garageRoutes = require("./src/routes/garage.routes");
const uploadRoutes = require("./src/routes/upload.routes");
const adminRoutes = require("./src/routes/admin.routes");
const connectDB = require("./src/config/db");
const Admin = require("./src/models/Admin.model.js");

const seedAdmin = async () => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            await Admin.create({
                name: "Admin",
                email: "admin@garagecrm.com",
                password: "admin123",
            });
            console.log("Default admin seeded: admin@garagecrm.com / admin123");
        }
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
};

connectDB().then(() => {
    seedAdmin();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api/customer", customerRoutes);
app.use("/api/garage", garageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/jobcard", jobCardRoutes);
app.use("/api/quotation", quotationRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});