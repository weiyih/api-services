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
        type: Boolean
    },
    advanced_start_date: {
        type: Date
    },
    advanced_end_date: {
        type: Date
    }
});

module.exports = electionSchema;
// election_id: electionUUID,
// election_name: "Oakville Municipal Election 2020",
// election_start_date: "2020-01-01T00:00:00-05:00",
// election_end_date: "2020-12-31T24:00:00-05:00",
// advanced_polling: true,
// advanced_start_date: "2020-01-01T00:00:00-05:00",
// advanced_end_date: "2020-12-31T24:00:00-05:00",