const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electionSchema = new Schema({
    election_id: {
        type: String,
        index: true,
        unique: true,
    },
    election_name: {
        type: String,
        // required: true,
    },
    election_start_date: {
        type: Date
    },
    election_end_date: {
        type: Date
    },
    advanced_polling: {
        type: Number
    },
    advanced_start_date: {
        type: Date
    },
    advanced_end_date: {
        type: Date
    },
    channel_name: {
        type: String
    },
    contract_name: {
        type: String
    },
    created_at: {
        type: String
    },
    locked: {
        type: Number
    },
    progress: {
        type: Number
    },
    disabled: {
        type: Number
    }
});

module.exports = electionSchema;