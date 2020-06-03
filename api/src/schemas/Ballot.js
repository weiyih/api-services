const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    candidate_id: {
        type: String
    },
    candidate_name: {
        last_name: {
            type: String,
            // required: true,
        },
        first_name: {
            type: String,
            // required: true,
        },
    }
});

const ballotSchema = new mongoose.Schema({
    election_id: {
        type: String,
    },
    ward: {
        type: Number
    },
    candidate: [candidateSchema],
});

module.exports = ballotSchema;

// //     election_id: electionUUID,
// ward: 1,
// candidate: [
//     {
//         candidate_id: "2d8248ab-a831-4b5c-a3b2-6c5ef317731a",
//         candidate_name: { last_name: "Hawes", first_name: "Lena" }
//     },
//     {
//         candidate_id: "4610567e-8f6c-4c8a-acfd-5b92cfaf0766",
//         candidate_name: { last_name: "Bartlett", first_name: "Stanley" }
//     },
//     {
//         candidate_id: "8ee1f294-f4a3-43c6-be75-0edc74d79952",
//         candidate_name: { last_name: "Goodman", first_name: "Faizah" }
//     },
//     {
//         candidate_id: "007d60e9-8942-463a-9264-37bc9190ef04",
//         candidate_name: { last_name: "Cisneros", first_name: "Rianna" }
//     },
//     {
//         candidate_id: "bacfbb4b-c5c8-4209-9528-0db0760b9cd7",
//         candidate_name: { last_name: "Wilkinson", first_name: "Ned" }
//     }