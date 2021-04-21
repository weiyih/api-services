const ElectionDB = require("../controllers/ElectionDBController");
const { Transaction } = require("fabric-network");
const { updateUserVoteStatus } = require("./voter");
const { submitBallotTransaction, queryBallotExist } = require("../controllers/TransactionController");
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
                    district_id: districtId,
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
    console.log('checking vote status')
    try {
        const voterData = req.voterData;
        const electionData = req.electionData;
        const electionId = electionData.election_id;

        console.log(electionData)
        // Retrieve voterStatus from the voterData
        const electionStatus = voterData.election_status
        const election = electionStatus.filter(election => {
            return election.election_id == electionId;
        })
        const voteStatus = election[0].vote_status;

        if (voteStatus == 0) {
            next() //validateBallot
        } else if (voteStatus == 1) {
            // TODO - Refactor to EventListener to better handle network delays
            const ballotExist = await checkVoteExists(voterData);

            if (ballotExist) {
                const ballotTimestamp = Number(ballotExist.timestamp)
                updateUserVoteStatus(voterData.voter_id, electionData.election_id, ballotTimestamp)
            } else {
                updateUserVoteStatus(voterData.voter_id, electionData.election_id, 0)
            }
        } else if (voteStatus > 1) {
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
    console.log('validating ballot')
    try {
        const ballot = req.body
        const electionData = req.electionData;
        const voterData = req.voterData;

        if (!ballot) {
            throw Error("missing ballot data");
        }

        const timestamp = Date.now();
        var validBallotData = await verifyBallotData(electionData, ballot, voterData);
        var validElectionDates = verifyElectionDates(electionData, timestamp);
        var validateBallotKeys = verifyBallotKeyData(ballot)

        console.log(validBallotData)
        console.log(validElectionDates)
        console.log(validateBallotKeys)
        // Ballot validation list
        const validationChecks = [validBallotData, validElectionDates, validateBallotKeys]
        if (validationChecks.every(Boolean)) {
            console.log("validated")
            const ballotData = {
                id: voterData.voter_id,
                election_id: ballot.election_id,
                district_id: ballot.district_id,
                candidate_id: ballot.candidate_id,
                timestamp: timestamp
            }
            req.ballotData = ballotData
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
    console.log('submitting ballot')
    const voterData = req.voterData;
    const electionData = req.electionData;
    const channel = electionData.channel_name
    const ballotData = req.ballotData

    try {
        console.log("attempting to submit")
        // TODO - TS Enum for status
        // electionId, ballotId, status 0 - not voted, 1 - pending, 1+ - timestamp
        const updateStatus = await updateUserVoteStatus(voterData.voter_id, electionData.election_id, 1)

        if (updateStatus) {
            // NOTE: Assume ballot will always be unique as the submission will check voter status
            // before submitBallot middleware is reached
            const ballotResult = await submitBallotTransaction(ballotData, channel)

            if (ballotResult) {
                const timestamp = ballotResult.timestamp
                updateUserVoteStatus(voterData.voter_id, electionData.election_id, timestamp)
                const response = {
                    "message": "success",
                    "data": "success"
                }
                console.log("submited")
                res.json("response")
            }
        }
    } catch (error) {
        // NOTE: See note on TransactionController about the errors

        // DIRTY HACK - catches errors from ballot submission.
        // checks if ballot exists.
        // true - assume something went wrong in asynchronous flow of previous ballot transaction
        // updates the voter vote status for election
        // false - assume something went wrong and just give generic error
        const ballotExist = await checkVoteExists(voterData);
        if (ballotExist) {
            const ballotTimestamp = Number(ballotExist.timestamp)
            updateUserVoteStatus(voterData.voter_id, electionData.election_id, ballotTimestamp)
            console.log('checking ballot exist - success')
            // TODO - response ballot exists

            const response = {
                success: "success",
                data: "ballot transacted"
            }
            res.json(response)
        } else {
            updateUserVoteStatus(voterData.voter_id, electionData.election_id, 0)
            // TODO - response unabl
            console.log('caught -unable to process vote all errors')
            res.json(error)
        }
    }
}

// Retrieves the ballot by querying the blockchain network
async function checkVoteExists(voter) {
    try {
        const ballotExists = await queryBallotExist(voter.voter_id)
        console.log(ballotExists)
        return ballotExists
    } catch (error) {
        throw Error(error)
    }

}


// Helper function to determine if ballot contains valid data
async function verifyBallotData(electionData, ballotData, voterData) {
    // Election ID - check if election id submitted matches ballot election id
    const electionId = electionData.election_id;
    if (ballotData.election_id != electionId) return false;

    // District ID - Check if voter data district id matches ballot district id
    // retrieve the election_status to obtain the district_id
    const selected = voterData.election_status.find(election =>
        election.election_id == electionId
    );
    const districtId = selected.district_id
    if (ballotData.district_id != districtId) return false;

    // Candidate ID - Check if candidate id exists in the district
    // Load the ballot for the user and district
    const districtBallot = await ElectionDB.getBallot(electionId, districtId)
    const candidateFound = districtBallot.candidates.find(candidate =>
        ballotData.candidate_id == candidate.candidate_id
    )
    if (!candidateFound) return false;
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

// Helper function to verify incoming data has all the necessary keys and data
function verifyBallotKeyData(ballot) {
    const keys = ['election_id', 'district_id', 'candidate_id']
    const hasKeys = keys.every(key => ballot.hasOwnProperty(key))

    if (hasKeys) {
        for (var key in ballot) {
            if (ballot[key] == null && ballot[key] == "")
                return false;
        }
        return true;
    }
    return false
}

module.exports = { getBallot, validateBallot, submitBallot, checkVoteStatus }
