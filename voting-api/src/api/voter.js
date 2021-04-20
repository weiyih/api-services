const VoterDB = require("../controllers/VoterDBController");

// Returns boolean if updated successfully
async function updateUserVoteStatus(electionId, ballotId, status) {
    try {
        const data = await VoterDB.updateVoteStatus(electionId, ballotId, status)
        if (data) return true;
        else return false
    } catch (error) {
        console.log(error)
        throw Error(error)
    }
}
// Returns 0,1, or the timestamp of the vote
async function getVoteStatus(electionId, ballotId, status) {
    try {
        const data = await VoterDB.getVoteStatus(electionId, ballotId, status)
        if (data) return data;
    } catch (error) {
        console.log(error)
        throw Error(error)
    }
}


module.exports = { updateUserVoteStatus, getVoteStatus }