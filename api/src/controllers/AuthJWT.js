/*
* JWT Authentication Middleware to access routes
* JWT Token is generated
*/

// TODO - docker secrets for pem files
const { JWT_EXPIRY_SECOND, JWT_PRIVATE_KEYFILE } = process.env;

const JWT_PRIVATE_KEY = fs.readFileSync(
    path.resolve(__dirname, JWT_PRIVATE_KEYFILE)
);

// TODO - REMOVE -> App will be using public key to encrypt
const JWT_PUBLIC_KEY = fs.readFileSync(
    path.resolve(__dirname, "./config/ec_public.pem")
);

exports.authenticate = function(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // Authorization header missing
        if (authHeader) {
            const authToken = authHeader.split(" ")[1];
            // TODO replace with private key
            const verified = jwt.verify(authToken, JWT_PUBLIC_KEY);
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
}

/*
* Generate JWT Token 
*/
jwt.sign(
    { user_id: doc.email },
    JWT_PRIVATE_KEY,
    { expiresIn: JWT_EXPIRY_SECOND, algorithm: "ES256" },
    function (err, token) {
        if (err) {
            console.log(err);
            throw Error("error token")
        }
        let response = {
            status: "success",
            message: "logged in",
        };
        // Set cookie as token string and send
        res.cookie("token", token, { maxAge: JWT_EXPIRY_SECOND });
        res.send(response);
    }
);