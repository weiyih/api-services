require("dotenv").config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    port: parseInt(process.env.PORT, 10),

    databaseURL: process.env.MONGODB_URI,

    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,

    emails: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
}