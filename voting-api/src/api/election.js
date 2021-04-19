const ElectionDB = require("../controllers/ElectionDBController");

async function loadElection(req, res, next) {
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

async function getElections(req, res, next) {
    try {
        const data = await ElectionDB.getAllElection();
        res.json(data);
        // next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

module.exports = { loadElection, getElections }