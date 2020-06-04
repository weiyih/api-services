const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*
voterDB.voter.insert({
    voter_id: '3b241101-e2bb-4255-8caf-4136c566a962',
    first_name: 'Kevin',
    middle_name: '',
    last_name: 'Wei',
    date_birth: '1991-01-31',
    street_number: '1430',
    street_name: 'Trafalgar',
    street_suffix: 'Rd',
    town: 'Oakville',
    zip_code: 'L6H2L1',
    ward: 1,
    vote_status: 'No',
    vote_online: 'No',
    __v: 0 
})
*/

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
    ward: {
        type: String,
    },
    vote_status: {
        type: String,
    },
    vote_online: {
        type: String,
    }
})

module.exports = voterSchema;