const UserDB = require("../controllers/UserDBController");
const VoterDB = require("../controllers/VoterDBController");
const { generateJWT } = require("../services/auth")
const bcrypt = require("bcrypt");
const AppUser = require('../models/app/AppUser')
require('dotenv').config;

const { SALT_ROUNDS } = process.env

async function loadUser(req, res, next) {
    console.log('loading user')
    const verified = req.verified
    try {
        const user = await UserDB.getUserByEmail(verified.username);
        const voter = await VoterDB.getVoterById(user.voter_id);
        req.userData = user;
        req.voterData = voter;
        next();
    } catch (error) {
        const response = {
            success: "error",
            error: { message: error.message }
        }
        res.json(response);
    }
}

async function login(req, res) {
    try {
        const login = req.body;
        if (!login || !login.hasOwnProperty('username') || !login.hasOwnProperty('password')) {
            throw Error("Invalid username or password");
        }

        const user = await UserDB.getUserByEmail(login.username)
        const passwordMatch = await bcrypt.compare(login.password, user.password)
        const biometricMatch = await bcrypt.compare(login.password, user.biometric)

        // const deviceMatch = await bcrypt.compare(login.device_id, user.device_id)
        // TODO - Conditions array 
        if (passwordMatch || biometricMatch) {
            // Generate JWT based on email
            const authToken = generateJWT(user)
            const appUser = {
                username: user.email,
                token: authToken,
                verified: user.verified_status
            }

            const response = {
                success: "success",
                data: appUser
            }
            res.json(response);
        } else {
            throw Error("Invalid username or password");
        }

    } catch (error) {
        const response = {
            success: "error",
            error: { message: error.message }
        };
        res.json(response);
    }
}

async function registerBiometric(req, res) {
    const biometric = req.body;
    const verified = req.verified
    try {
        const hash = await bcrypt.hash(biometric.password, Number(SALT_ROUNDS));
        const updated = await UserDB.updateBiometricPassword(verified.username, hash)
        if (updated) {

            const response = {
                success: "success",
                data: { message: "biometric registered" }
            }
            res.json(response);

        } else {
            throw Error("biometric registration unsuccessful")
        }
    } catch (error) {

        const response = {
            success: "error",
            error: { message: error.message }
        }
        res.json(response);
    }
}

async function signupUser(req, res) {
//     const user = req.body;

//     UserDB.createUser(user, "voter-uuid-placeholder")
//         .then((res) => {
//             const response = {
//                 status: true,
//                 data: {
//                     message: "signup successful",
//                     data: res.user_id,
//                 },
//             };
//             res.send(response);
//         })
//         .catch((error) => {
//             const response = {
//                 status: false,
//                 data: {
//                     message: "signup unsuccessful",
//                     error: error,
//                 },
//             };
//             res.send(response);
//         });
}

// Use-case registration match device id
async function verifyUser(req, res) {

}

module.exports = { loadUser, login, signupUser, registerBiometric }