const VoterDB = require("../controllers/VoterDBController");

async function updateVoteStatus(electionId, ballotId, status) {
    try {
        const data = await VoterDB.updateVoteStatus(electionId, ballotId, status)
        if (data) return true;
    } catch (error) {
        console.log(error)
    }
}

async function getVoteStatus(electionId, ballotId, status) {
    try {
        const data = await VoterDB.getVoteStatus(electionId, ballotId, status)
        if (data) return true;
    } catch (error) {
        console.log(error)
    }
}


module.exports = { updateVoteStatus, getVoteStatus }