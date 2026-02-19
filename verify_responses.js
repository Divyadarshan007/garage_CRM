const http = require('http');

const test = async (path, method = 'GET', body = null) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`\n--- Test: ${method} ${path} ---`);
                console.log(`Status: ${res.statusCode}`);
                console.log(`Response Body: ${data}`);
                resolve();
            });
        });

        req.on('error', (error) => {
            console.error(`Error: ${error.message}`);
            resolve();
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const runTests = async () => {
    // 1. Health check (Success)
    await test('/health');

    // 2. Admin Login (Success)
    await test('/api/admin/login', 'POST', { email: 'admin@garagecrm.com', password: 'admin123' });

    // 3. Admin Login (Error - Wrong Password)
    await test('/api/admin/login', 'POST', { email: 'admin@garagecrm.com', password: 'wrong' });

    // 4. Admin Login (Error - Invalid Email)
    await test('/api/admin/login', 'POST', { email: 'wrong@test.com', password: 'admin' });
};

runTests();
