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
            data: { error: error.message }
        }
        res.json(response);
    }
}


/*
* Responds with all valid elections
*/
async function getElections(req, res) {
    try {
        const data = await ElectionDB.getAllElection();

        const response = {
            success: "success",
            data: { data }
        }
        res.json(response);
    } catch (error) {
        const response = {
            success: "error",
            data: { error: error.message }
        }
        res.json(response);
    }
}

module.exports = { loadElection, getElections }