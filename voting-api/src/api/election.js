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
        console.log(error)
        return res.status(500).send({ message: error.message });
    }
}


/*
* Responds with all valid elections
*/
async function getElections(req, res) {
    try {
        const data = await ElectionDB.getAllElection();
        res.json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

module.exports = { loadElection, getElections }