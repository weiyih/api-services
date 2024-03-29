const DBFactory = require("./DBFactory");
const userSchema = require("../models/api/User");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

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

    /* 
    * Retrieves the user document
    */
    async getUserByEmail(username) {
        const query = User.findOne()
            .where("email").equals(username)
            .select("-_id -__v"); //Strips objectId(_id) and document version(__v)
        try {
            const data = await query.exec();
            return data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    // async getUserById(userId) {
    //     const query = User.findOne({ user_id: userId });
    //     try {
    //         const data = await query.exec();
    //         return data;
    //     } catch (error) {
    //         console.log(error)
    //         throw error
    //     }
    // }

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

    async updateBiometricPassword(username, newPassword) {
        const filter = { 'email': username };
        const update = { 'biometric': newPassword };
        const options = {
            new: true,
        };

        try {
            const doc = await User.findOneAndUpdate(filter, update, options);
            if (!doc) {
                throw Error("unable to update biometric password")
            }
            return doc;
        } catch (error) {
            console.log(error);
            throw Error(error)
        }
    }

    async getAllUsers() {
        const query = User.find()
            .select("-_id -__v -password -biometric -device_id");
        try {
            const data = await query.exec();
            return data;
        } catch (error) {
            console.log(error);
            throw Error(error)
        }
    }
}

module.exports = new UserDB();
