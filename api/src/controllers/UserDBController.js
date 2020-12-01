const DBFactory = require('./DBFactory');
const userSchema = require("../schemas/User");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

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

  async loadUser(userId) {
    const query = User.findOne({ user_id: userId });
    const res = await query.exec();

    if (!res) {
      return null;
    }
    return res;
  }

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
