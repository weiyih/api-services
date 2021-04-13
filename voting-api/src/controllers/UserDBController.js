const DBFactory = require("./DBFactory");
const userSchema = require("../models/User");
const appUserSchema = require("../models/AppUser")
const { v4: uuidv4 } = require("uuid");
const authJWT = require("../services/auth")
require("dotenv").config();

const { JWT_EXPIRY_SECOND } = process.env

/**
 * Mongoose Schema
 * */
let User;

class UserDB {
    constructor() {
        const { USER_DB } = process.env;

        try {
            const db = DBFactory.create(USER_DB);
            // Buffer registering models
            db.conn.on("connected", () => {
                console.log(`Registering ${USER_DB} models`);
                User = db.conn.model("user", userSchema, "user");
            });
        } catch (error) {
            console.log(error);
        }
    }

    // TODO - Move login logic into a separate function. Should not be in the data access layer

    async login(req, res) {
        try {
            const login = req.body;

            if (login == null) {
                throw Error("invalid username/password");
            }

            const user = await this.getUserEmail(login)



            // TODO - Password hash comparison
            if (doc.email == user.username && doc.password == user.password) {
                // TODO - Compare deviceIdHash
                // if (doc.deviceId == user.deviceId ) {
                // Generate JWT based on email

                const authToken = await authJWT.generateJWT(doc)

                const appUser = new AppUser({
                    username: user.email,
                    token: authToken,
                    verified: user.verified
                })

                if (authToken) {
                    // Set cookie as token string and send
                    res.cookie("token", token, { maxAge: parseInt(JWT_EXPIRY_SECOND) });
                    res.json(appUser)
                }
            } else {
                throw Error("invalid username/password");
            }

        } catch (error) {
            console.log(error.message);
            let response = {
                status: "failed",
                message: "invalid username/password",
            };
            return res.send(response);
        }
    }

    /* 
    * Retrieves the user document
    * p
    */
    async getUserEmail(user) {
        const query = User.findOne()
        .where("email")
        .equals(user.username)
        .select("-_id -__v"); //Strips objectId(_id) and document version(__v)
        try {
            const data = await query.exec();
            return data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getUserId(userId) {
        const query = User.findOne({ user_id: userId });
        try {
            const data = await query.exec();
            return data;
        } catch (error) {
            console.log(error)
            throw error
        }
    } 

    // TODO - Refactor to middleware
    async createUser(userData, voterId) {
        const tempUserId = uuidv4();
        const tempVoterId = uuidv4();
        const currentDate = new Date().toISOString();

        const user = new User({
            user_id: tempUserId,
            full_name: {
                first_name: userData.first_name,
                middle_name: userData.middle_name,
                last_name: userData.last_name,
            },
            email: userData.email,
            email_status: "Unverified",
            date_of_birth: userData.date_of_birth,
            // voter_id: voterId,
            voter_id: tempVoterId,
            date_create: currentDate,
            driver_license: userData.driver_license,
            // device_id: userData.device_id
            device_id: "",
        });

        // TODO check for UUID collision
        // TODO -Validate schema before save

        //save to database
        try {
            const result = await user.save();
            console.log("Result");
            console.log(result);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}
module.exports = new UserDB();
