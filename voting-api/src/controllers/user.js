const ElectionDB = require("./ElectionDBController");
const UserDB = require("./UserDBController");
const VoterDB = require("./VoterDBController");

async function loadData(req, res, next) {
    const verified = req.verified
    try {
        const user = await UserDB.getUserId(verified.username)
        const voter = await VoterDB.getVoter(user.voter_id)
        req.user = user
        req.voter = voter
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message });
    }
}

module.exports = { loadData }