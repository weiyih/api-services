class AppBallot {
    constructor(electionId, districtId, districtName, candidateList) {
        this.election_id = electionId;
        this.district_id = districtId;
        this.district_name = districtName;
        this.candidate_list = candidateList;
    }
}

module.exports = AppBallot;