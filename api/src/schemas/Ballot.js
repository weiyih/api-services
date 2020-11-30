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
    district: [districtSchema],
});

module.exports = ballotSchema;

// election_id: 'c88aeee1-134b-403c-bc37-651a890548c0',
//     districts: [{
//         district_id: 1,
//         candidates: [{
//             candidate_id: '2d8248ab-a831-4b5c-a3b2-6c5ef317731a',
//             candidate_name: 'Gwen Stacy'
//         },
//         {
//             candidate_id: '4610567e-8f6c-4c8a-acfd-5b92cfaf0766',
//             candidate_name: 'Peter Parker'
//         },
//         {
//             candidate_id: '007d60e9-8942-463a-9264-37bc9190ef04',
//             candidate_name: 'Mary Jane'
//         },
//     ]},