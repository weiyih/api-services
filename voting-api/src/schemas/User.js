const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: String,
        index: true,
    },
    first_name: {
        type: String,
        // required: true,
    },
    middle_name: {
        type: String,
        // required: false,
    },
    last_name: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        // required: true,
    },
    email_status: {
        type: String
    },
    password: {
        type: String,
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
    }
})

module.exports = userSchema;