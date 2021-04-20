const ElectionDB = require("../controllers/ElectionDBController");
const { Transaction } = require("fabric-network");
const { getVoteStatus, updateUserVoteStatus } = require("./voter");
const { submitBallotTransaction } = require("../controllers/TransactionController");
// const TransactionController = require("../controllers/TransactionController");


/*
* Retrieves and responds with a AppBallot json object
* ballot is generated based on election id and district id
*/
async function getBallot(req, res) {
    const voter = req.voterData;
    const electionId = req.params.id;
    const electionList = voter.election_status;

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
                // TODO - Create a model interface to ensure response ballot is valid?

                // Generate candidate list from ballot data
                const candidateList = new Array()
                for (cand of ballot.candidates) {
                    const candidate = { candidate_id: cand.candidate_id, candidate_name: cand.candidate_name }
                    candidateList.push(candidate)
                }
                const data = {
                    election_id: electionId,
                    district_id: ballot.districtId,
                    district_name: ballot.district_name,
                    candidate_list: candidateList
                }
                res.json(data);
            }
            else {
                throw Error("unable to retrieve ballot")
            }
        } else {
            throw Error("unable to retrieve ballot")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

/*
* Checks if the voter's vote_status to determine if the blockchain has received a vote
*/
async function checkVoteStatus(req, res, next) {
    try {
        const voter = req.voterData;
        const election = req.electionData;

        // Check Voter DB for the vote_status
        const voteStatus = getVoteStatus(voter.voter_id, election.election_id)

        if (voterStatus == 0) {
            next()
        } else if (voterStatus == 1) {
            // PENDING VOTE
            // TODO - registerEventListener()
        } else if (voterStatus > 1) {
            res.send("already voted")
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message });
    }
}


// Validates the ballot data before submitBallot is called
async function validateBallot(req, res, next) {
    try {
        const ballot = req.body
        const election = req.electionData;
        const voter = req.voterData;

        if (!ballot) {
            throw Error("missing ballot data");
        }

        const timestamp = Date.now();

        var validBallotData = await verifyBallotData(election, ballot, voter);
        var validElectionDates = verifyElectionDates(election, timestamp);

        // Ballot validation list
        const validationChecks = [validBallotData, validElectionDates]
        if (validationChecks.every(Boolean)) {
            next(); //submitBallot
        } else {
            throw Error("invalid ballot data");
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message });
    }
}

// Submit ballot data for transaction on the blockchain
async function submitBallot(req, res) {
    const voter = req.voterData;
    const election = req.electionData;
    const channel = election.channel_name
    const ballot = req.body

    try {
        // TODO - TS Enum for status
        // electionId, ballotId, status 0 - not voted, 1 - pending, 2 - voted
        const updateStatus = updateUserVoteStatus(voter.voter_id, election.election_id, 1)

        if (updateStatus) {
            // NOTE: Assume ballot will always be unique as the submission will check voter status
            // before submitBallot middleware is reached
            const ballotResult = await submitBallotTransaction(ballot, channel)

            if (ballotResult)  {
                const timestamp = ballotResult.timestamp
                updateUserVoteStatus(voter.voter_id, election.election_id, timestamp)
                res.send("success")
            }
        }
    } catch (error) {
        console.log(error)
        updateUserVoteStatus(voter.voter_id, election.election_id, 0)
        res.send("unable to submit ballot")

    }
}

// Helper function to determine if ballot contains valid data
async function verifyBallotData(election, ballot, voter) {
    const electionId = election.electionId;
    // Election ID - check if election id submitted matches ballot election id
    if (ballot.election_id != electionId) return false;

    // District ID - Check if voter data district id matches ballot district id
    const districtId = voter.vote.find(district =>
        district.election_id == electionId
    );
    if (ballot.district_id != districtId) return false;

    // Candidate ID - Check if candidate id exists in the district
    const districtBallots = await ElectionDB.getBallot(electionId, districtId)
    const found = districtBallots.districts.find(district =>
        district.candidates.find(candidate => candidate.candidate_id == ballot.candidate_id)
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

module.exports = { getBallot, validateBallot, submitBallot, checkVoteStatus }
