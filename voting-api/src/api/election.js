const ElectionDB = require("../controllers/ElectionDBController");

async function loadElection(req, res, next) {
    console.log('loading election')
    const electionId = req.params.id
    try {
        if (!electionId) {
            throw ("Error - Missing election id")
        }
        const election = await ElectionDB.getElection(electionId);
        req.electionData = election;
        next()
    } catch (error) {
        const response = {
            success: "error",
            error: { message: error.message }
        }
        res.json(response);
    }
}


/*
* Responds with all valid elections
*/
async function getElections(req, res) {
    try {
        const voterData = req.voterData
        const elections = await ElectionDB.getAllElection();
        const voterStatus = voterData.election_status

        // elections.forEach( election => {
        //     let match = voterStatus.find( status => status.election_id == election.election_id )
        //     if (match) election.vote_status = match.vote_status
        // })

        const output = elections.map(election => {
            const match = voterStatus.find(status => status.election_id == election.election_id);
            if (match) return { ...election._doc, vote_status: match.vote_status };
        });
        
        const response = {
            success: "success",
            data: output
        }
        res.json(response);
    } catch (error) {
        const response = {
            success: "error",
            error: { message: error.message }
        }
        res.json(response);
    }
}

module.exports = { loadElection, getElections }