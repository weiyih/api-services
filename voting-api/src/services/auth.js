const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();

/*
* JWT Authentication Middleware to access routes
* JWT Token is generated
*/
const { JWT_EXPIRY_SECOND } = process.env;

const JWT_PRIVATE_KEY = fs.readFileSync(
    path.resolve(__dirname, "../config/ec_private.pem")
);

const JWT_PUBLIC_KEY = fs.readFileSync(
    path.resolve(__dirname, "../config/ec_public.pem")
);

const JWT_ALGORITHM = "ES256"

/*
* JWT Authentication Middleware to access routes
*/
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // Check if authorization header missing
        if (authHeader) {
            const authToken = authHeader.split(" ")[1];
            const verified = jwt.verify(authToken, JWT_PUBLIC_KEY);
            // stores the decoded jwt token in verified
            if (verified) {
                req.verified = verified;
                next();
            } else {
                return res.status(401).end();
            }
        } else {
            return res.status(401).end();
        }
    } catch (error) {
        return res.status(401).end();
        // if (error instanceof jwt.JsonWebTokenError) {
        //   return res.status(401).end();
    }
};

/*
* Generates a JWT token that contains the user_email (username)
* JWT_EXPIRY_MILLISECOND is 30mins
* @param(user) - User object from UserDB
*/
async function generateJWT(user) {
    // Synchronous generation of token
    return jwt.sign(
        { username: user.email },
        JWT_PRIVATE_KEY,
        { expiresIn: parseInt(JWT_EXPIRY_SECOND), algorithm: JWT_ALGORITHM }
        // async
        // function (error, token) {
        //     if (error) {
        //         console.log(error);
        //         throw Error(`Error generating JWT token - ${error}`);
        //     }
        //     else {
        //         console.log(`Token: ${token}`)
        //         return token
        //     }
        // }
    )
}

async function verifyDevice(req, res, next) {
    try {
        const user = req.userData;
        const userDeviceId = req.data.device_id;

        const match = await bcrypt.compare(userDeviceId, user.device_id)
        if (match) {
            next();
        } else {
            throw Error ("Error - Unverified device")
        }
    } catch (error) {
        // TODO - replace with different workflow and error code
        return res.status(401).end();
    }
}

module.exports = { authenticate, generateJWT }