const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

/*
* JWT Authentication Middleware to access routes
* JWT Token is generated
*/

// TODO - docker secrets for pem files
const { JWT_EXPIRY_SECOND } = process.env;

const JWT_PRIVATE_KEY = fs.readFileSync(
    path.resolve(__dirname, "../config/ec_private.pem")
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
            const verified = jwt.verify(authToken, JWT_PRIVATE_KEY);
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
        { user_id: user.email },
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

module.exports = { authenticate, generateJWT }