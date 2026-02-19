const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

let firebaseApp = null;

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebaseAdmin = () => {
    try {
        if (firebaseApp) {
            return firebaseApp;
        }

        let serviceAccount;

        // Use environment variables (support both GOOGLE_PRIVATE_KEY and FIREBASE_PRIVATE_KEY)
        const privateKey = process.env.GOOGLE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

        if (projectId && privateKey && clientEmail) {
            console.log(`🔍 Initializing Firebase for project: ${projectId}`);

            // Robust PEM formatting: 
            // 1. Replace escaped newlines if they exist
            // 2. Ensure BEGIN/END headers are present
            // 3. Ensure actual newlines exist if it's a long continuous string
            let formattedKey = privateKey.replace(/\\n/g, "\n");

            // If the key is just one line (after replacing \n), it might still be missing 
            // the required formatting for some versions of the SDK if it's not strictly PEM.
            // But usually replace(/\\n/g, "\n") is enough if the .env has literal \n

            serviceAccount = {
                projectId,
                privateKey: formattedKey,
                clientEmail,
            };

            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

            console.log("✅ Firebase Admin initialized successfully");
        } else {
            console.warn("⚠️ Firebase credentials missing in environment variables.");
            if (!projectId) console.warn("   - Missing FIREBASE_PROJECT_ID");
            if (!privateKey) console.warn("   - Missing GOOGLE_PRIVATE_KEY/FIREBASE_PRIVATE_KEY");
            if (!clientEmail) console.warn("   - Missing FIREBASE_CLIENT_EMAIL");
        }

        return firebaseApp;
    } catch (error) {
        console.error("❌ Firebase Admin initialization error:", error);
        // Log a snippet of the key safely for debugging if there's a parsing error
        const key = process.env.GOOGLE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;
        if (key) {
            console.error(`   Key starts with: ${key.substring(0, 30)}...`);
            console.error(`   Key length: ${key.length}`);
        }
        throw error;
    }
};

/**
 * Verify Firebase ID Token
 */
const verifyIdToken = async (idToken) => {
    try {
        if (!firebaseApp) {
            initializeFirebaseAdmin();
        }

        if (!firebaseApp) {
            throw new Error("Firebase Admin not initialized. Check your environment variables.");
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error("Firebase token verification error:", error.message);
        throw error;
    }
};

module.exports = {
    admin,
    initializeFirebaseAdmin,
    verifyIdToken
};
