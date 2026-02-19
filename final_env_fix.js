const fs = require('fs');
const jsonPath = 'c:/Users/Divya/Downloads/garage-crm-24600-firebase-adminsdk-fbsvc-de72cb00cd.json';
const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const envContent = [
    'PORT=5000',
    'MONGO_URL=mongodb://localhost:27017/garage',
    'JWT_SECRET=mySecret@12345',
    '',
    `FIREBASE_PROJECT_ID=${serviceAccount.project_id}`,
    `FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`,
    `GOOGLE_PRIVATE_KEY="${serviceAccount.private_key.replace(/\n/g, '\\n')}"`
].join('\n') + '\n';

fs.writeFileSync('.env', envContent);
console.log(".env has been precisely reconstructed.");
