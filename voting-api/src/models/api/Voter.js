const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verifiedSchema = new Schema({
    verify_code: {
        type: String,
    },
    status: {
        type: Number,
        min: [0, 'Invalid verification status'],
        max: [1, 'Invalid verification status'],
    }
})

const electionStatusSchema = new Schema({
    election_id: {
        type: String,
        index: true,
        unique: true,
    },
    district_id: {
        type: Number
    },
    vote_status: {
        type: Number,
        min: [0, 'Invalid vote status'],
        max: [2, 'Invalid vote status'],
    }
})

const voterSchema = new Schema({
    voter_id: {
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
    date_of_birth: {
        type: Date,
        // required: true,
    },
    unit_number: {
        type:String
    },
    street_number: {
        type: String,
    },
    street_name: {
        type: String,
    },
    street_suffix: {
        type: String,
    },
    town: {
        type: String,
    },
    zip_code: {
        type: String,
    },    
    election_status: {
        type: [electionStatusSchema],
    },
    vote_online: {
        type: Number,
    },
    verified: {
        type: verifiedSchema,
    }
})

module.exports = voterSchema;