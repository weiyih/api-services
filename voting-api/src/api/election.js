const ElectionDB = require("../controllers/ElectionDBController");
const TransactionController = require("../controllers/TransactionController");

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
        console.log("retrieving elections")
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


async function queryElectionVotes(req, res) {
    try {
        console.log("querying elections")
        const electionId = req.params.id
        const election = await ElectionDB.getElection(electionId)
        const votes = await TransactionController.queryAllBallot(election.channel_name, election.contract_name)
        res.json(votes)
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
}

async function queryElection(req, res) {
    try {

        console.log("retrieving elections")
        const elections = await ElectionDB.getAllElection();

        // const response = {
        //     success: "success",
        //     data: output
        // }
        res.json(elections);
    } catch (error) {
        res.status(404).end()
    }
}


module.exports = { loadElection, getElections, queryElection, queryElectionVotes }