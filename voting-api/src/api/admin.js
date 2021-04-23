const ElectionDB = require("../controllers/ElectionDBController");
const TransactionController = require("../controllers/TransactionController");
const UserDB = require("../controllers/UserDBController");
const VoterDB = require("../controllers/VoterDBController");

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
        const elections = await ElectionDB.getAllAdminElection();

        res.json(elections);
    } catch (error) {
        res.status(404).end()
    }
}

async function queryUsers(req, res) {
    try {
        console.log("retrieving users")
        const users = await UserDB.getAllUsers();

        res.json(users);
    } catch (error) {
        res.status(404).end()
    }
}

async function queryVoters(req, res) {
    try {

        console.log("retrieving voters")
        const voters = await VoterDB.getAllVoters();
        
        res.json(voters);
    } catch (error) {
        res.status(404).end()
    }
}




module.exports = { queryUsers, queryVoters, queryElection, queryElectionVotes }