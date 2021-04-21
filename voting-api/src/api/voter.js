const VoterDB = require("../controllers/VoterDBController");

// Returns boolean if updated successfully
async function updateUserVoteStatus(electionId, ballotId, status) {
    try {
        const data = await VoterDB.updateVoteStatus(electionId, ballotId, status)
        if (data) return true;
        else return false
    } catch (error) {
        throw Error(error)
    }
}

module.exports = { updateUserVoteStatus }