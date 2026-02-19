const fs = require('fs');
const path = require('path');

// 1. Read the authentic JSON file
const jsonPath = 'c:/Users/Divya/Downloads/garage-crm-24600-firebase-adminsdk-fbsvc-de72cb00cd.json';
const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 2. Prepare the .env content
const envLines = [
    'PORT=5000',
    'MONGO_URL=mongodb://localhost:27017/garage',
    'JWT_SECRET=mySecret@12345',
    '',
    `FIREBASE_PROJECT_ID=${serviceAccount.project_id}`,
    `FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`,
    `FIREBASE_PRIVATE_KEY="${serviceAccount.private_key.replace(/\n/g, '\\n')}"`
];

// 3. Write the .env file
fs.writeFileSync('.env', envLines.join('\n') + '\n');

console.log(".env file has been reconstructed directly from the service account JSON.");
