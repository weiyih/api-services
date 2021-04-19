const VoterDB = require("../controllers/VoterDBController");

async function updateVoteStatus(electionId, ballotId, status) {
    try {
        const data = await VoterDB.updateUserVoteStatus(electionId, ballotId, status)
        if (data) return true;
    } catch (error) {
        console.log(error)
    }
}

module.exports = updateVoteStatus