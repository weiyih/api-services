class TransactionBallot {
    constructor(id, electionId, districtId, candidateId, time) {
        this.id = id;
        this.election_id = electionId; //string
        this.district_id = districtId; // string
        this.candidate_id = candidateId; // string
        this.timestamp = time // String
    }
}

module.exports = TransactionBallot;