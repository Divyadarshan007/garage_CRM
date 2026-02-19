require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');

const logPath = 'debug_log.txt';
function log(msg) {
    console.log(msg);
    fs.appendFileSync(logPath, msg + '\n');
}

if (fs.existsSync(logPath)) fs.unlinkSync(logPath);

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.GOOGLE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

log('Project ID: ' + projectId);
log('Client Email: ' + clientEmail);
log('Private Key length: ' + (privateKey ? privateKey.length : 'undefined'));

if (privateKey) {
    try {
        const formattedKey = privateKey.replace(/\\n/g, '\n');
        log('Formatted Key starts with: ' + formattedKey.substring(0, 30));
        log('Formatted Key ends with: ' + formattedKey.substring(formattedKey.length - 30));

        // Try parsing manually to see if it's a valid PEM
        if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----')) {
            log('❌ Error: Missing BEGIN header');
        }
        if (!formattedKey.includes('-----END PRIVATE KEY-----')) {
            log('❌ Error: Missing END header');
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                privateKey: formattedKey,
                clientEmail,
            }),
        });
        log('✅ Success: Firebase Admin initialized!');
    } catch (error) {
        log('❌ Error: Firebase Admin initialization failed:');
        log(error.stack || error.message);
    }
} else {
    log('❌ Error: GOOGLE_PRIVATE_KEY is missing');
}
