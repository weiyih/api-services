const ElectionDB = require("../controllers/ElectionDBController");
const AppCandidate = require("../models/AppCandidate");
const AppBallot = require("../models/app/AppBallot");
const { Transaction } = require("fabric-network");
const TransactionController = require("../controllers/TransactionController");
const VoterDB = require("../controllers/VoterDBController");
const { updateUserVoteStatus } = require("../controllers/VoterDBController");



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
                // Generate candidate list from ballot data
                const candidateList = new Array()
                for (cand of ballot.candidates) {
                    candidateList.push(new AppCandidate(cand.candidate_id, cand.candidate_name))
                }
                // Create the AppBallot data to return
                const data = new AppBallot(
                    electionId,
                    ballot.district_id,
                    ballot.district_name,
                    candidateList)
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

async function validateBallot(req, res, next) {
    try {
        const ballot = req.body
        const election = req.electionData;
        const user = req.userData;
        const voter = req.voterData;

        if (!ballot) {
            throw Error("Error - Missing ballot data");
        }

        const timestamp = Date.now();

        var validBallotData = await verifyBallotData(election, ballot, voter);
        var validElectionDates = verifyElectionDates(election, timestamp);

        // Boolean list
        const validationChecks = [ validBallotData, validElectionDates ]

        if (validationChecks.every(Boolean)) {
            next();
        }else {
            throw Error("Error - invalid ballot data");
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message });
    }
}

async function submitBallot(req, res) {
    try {
        const voter = req.voterData;
        const election = req.electionData;

        // electionId, ballotId, status 0 - not voted, 1 - pending, 2 - voted
        const update = updateUserVoteStatus(voter.voter_id, election.election_id, 1)
        // Update voter status to pending
        // VoterDB.updateUserVoteStatus(voter.voter_id, election_id)


        await TransactionController.submitTransaction(ballot);

    } catch {

    }

}

async function checkVoteStatus(req, res, next) {
    try {
                const election = req.electionData;
        // TODO - check vote status
        const ballot = await Transaction.checkVote()
        if (ballot == null) {

        } else {
            next()
        }

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message });
    }
}

// Helper function to determine if ballot contains valid data
async function verifyBallotData(election, ballot, voter) {
    const electionId = election.electionId;
    // Election ID - check if election id submitted matches ballot election id
    if (ballot.election_id != electionId) return false;

    // District ID - Check if voter data district id matches ballot district id
    const districtId = voter.vote.find( district => 
        district.election_id == electionId
    );
    if (ballot.district_id != districtId) return false;

    // Candidate ID - Check if candidate id exists in the district
    const districtBallots = await ElectionDB.getBallot(electionId, districtId)    
    const found = districtBallots.districts.find( district => 
        district.candidates.find( candidate => candidate.candidate_id == ballot.candidate_id )
    )
    if (!found) return false;

    return true;
}

// Helper function to verify the current timestamp is between the election dates
function verifyElectionDates(election) {
    const timestamp = Date.now()

    const startTimestamp = Date.parse(election.election_start_date)
    const endTimestamp = Date.parse(election.election_end_date)

    // timestamp is before the election start and end times
    if (timestamp < startTimestamp || timestamp > endTimestamp) return false

    // advanced polling enabled
    if (election.advancedPolling) {
        const advancedStartTimestamp = Date.parse(election.advanced_start_date)
        const advancedEndTimestamp = Date.parse(election.advanced_end_date)

        if (timestamp < advancedStartTimestamp || timestamp > advancedEndTimestamp) return false
        else return true
    }
    return true
}

module.exports = { getBallot, validateBallot, submitBallot }
