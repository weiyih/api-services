const ElectionDB = require("../controllers/ElectionDBController");
const AppCandidate = require("../models/AppCandidate");
const AppBallot = require("../models/AppBallot");

async function checkVoteStatus(req, res, next) {

}

async function getBallot(req, res, next) {
    // Load user
    const voter = req.voter;
    const electionId = req.params.id;
    const electionList = voter.vote;

    var districtId = null;

    for (election of electionList) {
        if (election.election_id == electionId) {
            districtId = election.district_id;
            break;
        }
    }

    try {
        if (districtId) {
            const ballot = await ElectionDB.getBallot(electionId, districtId)

            if (ballot) {
                console.log("Type: ", typeof ballot)
                console.log("Ballot: \n", ballot)
                // Generate candidate list from ballot data
                const candidateList = new Array()
                for (cand of ballot.candidates) {
                    candidateList.push(new AppCandidate(cand.candidate_id, cand.candidate_name))
                }

                console.log(ballot.district_name);
                // Create the AppBallot data to return
                const data = new AppBallot(
                    electionId,
                    ballot.district_id,
                    ballot.district_name,
                    candidateList)

                console.log('Data: ', data);
                res.json(data);
            }
            else {
                throw Error("Unable to retrieve ballot")
            }
        } else {
            throw Error("Unable to retrieve ballot")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

// Check if ballot has incorrect data
function validateBallot(ballot) {
    // Invalid election id
    if (ballot.election_id !== ElectionDB.electionData.election_id) {
        return false;
    }

    // TODO - Ward/District Verification

    // Timestamp and election dates
    const currentTime = Date.now();
    const ballotTime = Number(ballot.timestamp);
    // TODO - REDUCE TIME
    const SUBMISSION_LIMIT = 6000000; // 10 minutes

    // Prevent ballot from being submitted if submission timestamp is >= SUBMISSION_LIMIT
    if (currentTime - ballotTime >= SUBMISSION_LIMIT) {
        return false;
    }

    // Ensure Election allows for electronic voting
    // Somewhat redundant but may be required in the future?
    if (ElectionDB.electionData.advanced_polling) {
        // Ensure voting period is within the advanced poll and election dates
        const advStartDate = Date.parse(
            ElectionDB.electionData.advanced_start_date
        );
        const advEndDate = Date.parse(ElectionDB.electionData.advanced_end_date);

        const electionStartDate = Date.parse(
            ElectionDB.electionData.election_start_date
        );
        const electionEndDate = Date.parse(
            ElectionDB.electionData.election_end_date
        );

        if (currentTime < advStartDate || currentTime >= advEndDate) {
            return false;
        }
        if (currentTime < electionStartDate || currentTime > electionEndDate) {
            return false;
        }

        // Ensure candidate selected is part of the list of eligible candidates
        const candidates = ElectionDB.ballotData.candidate;

        let candidateList = [];
        for (const [key, candidate] of Object.entries(candidates)) {
            candidateList.push(candidate.candidate_id);
        }
        if (!candidateList.includes(ballot.selected_candidate)) {
            return false;
        }
        return true;
    }
}

module.exports = { getBallot }
