const UserDB = require("../controllers/UserDBController");
const VoterDB = require("../controllers/VoterDBController");
const { generateJWT } = require("../services/auth")
const AppUser = require('../models/app/AppUser')

async function loadUser(req, res, next) {
    // JWT Verified
    const verified = req.verified
    try {
        const user = await UserDB.getUserByEmail(verified.username);
        const voter = await VoterDB.getVoterById(user.voter_id);
        req.userData = user;
        req.voterData = voter;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

async function login(req, res) {
    try {
        const login = req.body;
        if (!login) {
            throw Error("Error - missing username/password");
        }
        const user = await UserDB.getUserByEmail(login.username)

        // TODO - Password hash comparison
        // TODO - Compare deviceIdHash
        // TODO - Conditions array ("array.includes(false)")
        if (user.email == login.username && user.password == login.password) {
            // Generate JWT based on email
            const authToken = await generateJWT(user)

            const appUser = new AppUser(
                user.email,
                authToken,
                user.verified_status
            )

            // if (authToken) {
            //     res.cookie("token", authToken, { maxAge: parseInt(JWT_EXPIRY_SECOND) });
            res.json(appUser);
            // }
        } else {
            throw Error("Invalid username/password");
        }

    } catch (error) {
        console.log(error.message);
        let response = {
            error: "error",
            message: error.message,
        };
        return res.send(response);
    }
}

async function signupUser(req, res) {
    const user = req.body;
    /*
    * TODO
    * Verify user credentials by matching VoterDB
    */
    UserDB.createUser(user, "voter-uuid-placeholder")
        .then((res) => {
            const response = {
                status: true,
                data: {
                    message: "signup successful",
                    user: res.user_id,
                },
            };
            res.send(response);
        })
        .catch((error) => {
            const response = {
                status: false,
                data: {
                    message: "signup unsuccessful",
                    error: error,
                },
            };
            res.send(response);
        });
}

async function verifyUser(req, res) {
    
}

module.exports = { loadUser, login, signupUser }