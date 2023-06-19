const path = require('path');

// import .env.example variables
require('dotenv-safe').config({
    allowEmptyValues: true,
    path: path.join(__dirname, '../.env'),
    example: path.join(__dirname, '../.env.example'),
});

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    mongo: {
        uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
    },
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    /*emailConfig: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
    }*/
};