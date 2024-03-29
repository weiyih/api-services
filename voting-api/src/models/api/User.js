const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: String,
        index: true,
        // unique: true, //NOTE THIS IS NOT A VALIDATOR
    },
    first_name: {
        type: String,
        set: v => v.toLowerCase()
        // required: true,
    },
    middle_name: {
        type: String,
        set: v => v.toLowerCase()
        // required: false,
    },
    last_name: {
        type: String,
        set: v => v.toLowerCase()
        // required: true,
    },
    email: {
        type: String,
        set: v => v.toLowerCase(),
    },
    email_status: {
        type: String
    },
    password: {
        type: String,
    },
    biometric: {
        type:String,
    },
    voter_id: {
        type: String
    },
    date_create: {
        type: String
    },
    device_id: {
        type: String
    },
    driver_license: {
        type: String
    },
    verified_status: {
        type: Boolean
    }
})

module.exports = userSchema;