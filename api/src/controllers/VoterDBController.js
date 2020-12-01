const voterSchema = require("../schemas/Voter");
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

  // TODO - Refactor to return stream
  async getVoter(req, res, next) {
    const query = Voter.find().select("-_id -__v");
    try {
      const data = await query.exec();
      res.json(data);
    } catch (error) {
      // TODO - handle error
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  }

  // Retrieves the voter based on the voter uuid
  async loadVoter(voterId) {
    const query = Voter.findOne()
      .where("voter_id")
      .equals(voterId)
      .select("-_id -__v");
    try {
      const data = await query.exec();
      res.json(data);
    } catch (error) {
      // TODO - handle error
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  }

  // Updates Voter document of the voting status
  async updateUserVoteStatus(voterId, status) {
    const query = Voter.findOne()
      .where("voter_id")
      .equals(voterId)
      .select("-_id -__v");
    try {
      const data = await query.exec();
      res.json(data);
    } catch (error) {
      // TODO - handle error
      console.log(error);
      return res.status(500).send({ message: error.message });
    }

    // const query = Voter.findOneAndUpdate(
    //   { voter_id: voterId },
    //   { vote_status: status },
    //   { new: true }
    // );
    // const res = await query.exec();

    // if (!res) {
    //   return null;
    // }
    // return res;
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