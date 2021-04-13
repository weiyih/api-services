const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    candidate_id: {
        type: String
    },
    candidate_name: {
        type: String
    }
});

const districtSchema= new mongoose.Schema({
    district_id: {
        type: Number
    },
    candidates: [candidateSchema],
})

const ballotSchema = new mongoose.Schema({
    election_id: {
        type: String,
    },
    districts: [districtSchema],
});

module.exports = ballotSchema;