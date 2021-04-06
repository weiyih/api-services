const jwt = require("jsonwebtoken")

/*
* JWT Authentication Middleware to access routes
* JWT Token is generated
*/

// TODO - docker secrets for pem files
const { JWT_EXPIRY_SECOND, JWT_PRIVATE_KEYFILE } = process.env;

const JWT_PRIVATE_KEY = fs.readFileSync(
    path.resolve(__dirname, JWT_PRIVATE_KEYFILE)
);

const JWT_ALGORITHM = "ES256"

// TODO - REMOVE -> App will be using public key to encrypt
const JWT_PUBLIC_KEY = fs.readFileSync(
    path.resolve(__dirname, "./config/ec_public.pem")
);

/*
* JWT Authentication Middleware to access routes
*/
exports.authenticate = function (req, res, next) {
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
* JWT_EXPIRY_SECOND is 30mins
* @param(user) - User object from UserDB
*/
exports.generateJWT = function (user) {
    jwt.sign(
        { user_id: user.email },
        { expiresIn: JWT_EXPIRY_SECOND * 1000, algorithm: JWT_ALGORITHM },
        function (error, token) {
            if (error) {
                console.log(error);
                throw Error(`Error generating JWT token - ${error}`);
            }
            else {
                return token
            }
        }
    )
}