const { initializeFirebaseAdmin } = require("./src/config/firebaseAdmin");
const dotenv = require("dotenv");

// Load .env
dotenv.config();

console.log("🚀 Testing Garage Firebase Admin Initialization...");

try {
    const app = initializeFirebaseAdmin();
    if (app) {
        console.log("✅ SUCCESS: Garage Firebase Admin initialized successfully.");
        process.exit(0);
    } else {
        console.error("❌ FAILURE: Firebase Admin returned null.");
        process.exit(1);
    }
} catch (error) {
    console.error("❌ FAILURE: Garage Firebase Admin initialization failed!");
    console.error("Error Message:", error.message);
    process.exit(1);
}
