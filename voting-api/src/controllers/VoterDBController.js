const voterSchema = require("../models/api/Voter");
const DBFactory = require('./DBFactory');
require("dotenv").config();

let Voter;

class VoterDB {
    constructor() {
        const { VOTER_DB } = process.env;
        try {
            const db = DBFactory.create(VOTER_DB);
            // Buffer registering models
            db.conn.on("connected", () => {
                console.log(`Registering ${VOTER_DB} models`);
                Voter = db.conn.model("voter", voterSchema, "voter");
            });
        } catch (error) {
            console.log(error);
        }
    }

    async getVoterById(voterId) {
        const query = Voter.findOne()
            .where("voter_id")
            .equals(voterId)
            .select("-_id -__v"); //Strips objectId(_id) and document version(__v)
        try {
            const data = await query.exec();
            return data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    // Updates Voter document of the voting status
    /*
    * Updates the Voter subdocument of the vote status for the election
    * @Param - status
    * 0 - Not voted, 1 - Pending, 2 - Successfully voted
    */
    async updateVoteStatus(voterId, electionId, status) {
        const filter = { 'voter_id': voterId, 'election_status.election_id': electionId };
        const update = { 'election_status.$.vote_status': status };
        const options = {
            new: true,
            runValidators: true,
        };

        try {
            const doc = await Voter.findOneAndUpdate(filter, update, options)
            if (!doc) {
                throw Error("Error - Unable to update voter status")
            }
            return doc;
        } catch (error) {
            console.log(error);
            // TODO - Handle validation errors
            throw Error(error)
        }
    }

    // Returns JSON object of the list of election_status
    async getAllVoteStatus(voterId) {
        const query = Voter.findOne()
            .where('voter_id').equals(voterId)
            .select("-_id -__v"); //Strips objectId(_id) and document version(__v)
        try {
            const data = await query.exec();
            return data.election_status;
        }
        catch (error) {
            console.log(error)
            throw Error(error)
        }
    }

    // Updates Voter document to reflect the User intention to vote online when registering
    // async updateUserOnlineVote(voterId) {
    //   const query = Voter.findOneAndUpdate(
    //     { voter_id: voterId },
    //     { vote_online: "Yes" },
    //     { new: true }
    //   );
    //   const res = await query.exec();

    //   if (!res) {
    //     return null;
    //   }
    //   return res;
    // }
}

module.exports = new VoterDB();