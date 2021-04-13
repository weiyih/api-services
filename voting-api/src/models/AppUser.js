const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appUserSchema = new Schema({
    email: {
        type: String,
    },
    token: {
        type: String
    },
    verified_status: {
        type: String
    }
})

module.exports = appUserSchema;