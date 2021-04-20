class TransactionBallot {
    constructor(id, electionId, districtId, candidateId, time) {
        this.id = id;
        this.election_id = electionId; //string
        this.district_id = districtId; // string
        this.candidate_id = candidateId; // string
        this.timestamp = time // Number
    }
}

// TODO - Along with all other app schemas
// Use aggregate and virtual and toJSON functions to create the app response

// Might be better to create an model interface for this and just enforce the data object to match it

module.exports = TransactionBallot;