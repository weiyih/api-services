const DBFactory = require("./DBFactory");
const electionSchema = require("../models/api/Election");
const ballotSchema = require("../models/api/Ballot");
require("dotenv").config();

// Models
let Election;
let Ballot;
let Candidate;

class ElectionDB {
  constructor() {
    const { ELECTION_DB } = process.env;

    try {
      const db = DBFactory.create(ELECTION_DB);
      // Buffer registering models
      db.conn.on("connected", () => {
        console.log(`Registering ${ELECTION_DB} models`);
        Election = db.conn.model("election", electionSchema, "election");
        Ballot = db.conn.model("ballot", ballotSchema, "candidates");
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Retrieve all valid elections
   */
  async getAllElection() {
    // Query retrieves all elections that are not disabled (ie. deleted)
    // Strips away objectId(_id) and document version(__v)
    const query = Election.find()
      .where("disabled").equals(1)
      .select("-_id -__v");
    try {
      const data = await query.exec();
      return data;
      // next();
    } catch (error) {
      // TODO - handle error
      console.log(error);
    }
  }

  /**
   * Retrieve election by electionId
   */
  async getElection(electionId) {
    try {
      const query = Election.findOne()
        .where("election_id").equals(electionId)
        .select("-_id -__v"); //Strips objectId(_id) and document version(__v)

      const data = await query.exec();
      return data;
    } catch (error) {
      console.log(error);
      throw (`unable to retrieve election: ${electionId} from database`)
    }

  }

  /**
   * Retrieve election by electionId
   */
  async getBallot(electionId, districtId) {
    // TODO - use aggregate unwind lookups?
    const query = Ballot.findOne()
      .where("election_id").equals(electionId)
      .select("-_id -__v"); //Strips objectId(_id) and document version(__v)

    const election = await query.exec();
    const data = election.districts.filter(ballot => {
      return ballot.district_id == districtId;
    })
    // Return object instead of array
    return data[0];
  } catch(error) {
    console.log(error);
    throw ("unable to retrieve ballot from database")
  }


  // Temporary - admin call
  async getAllAdminElection() {
    // Strips away objectId(_id) and document version(__v)
    const query = Election.find()
      .select("-_id -__v");
    try {
      const data = await query.exec();
      return data;
      // next();
    } catch (error) {
      // TODO - handle error
      console.log(error);
    }
  }

  // Temporary - admin call
  async getAllAdminCandidates(electionId) {
    // Strips away objectId(_id) and document version(__v)
    const query = Ballot.findOne()
      .where("election_id").equals(electionId)
      .select("-_id -__v");
    try {
      const data = await query.exec();
      return data;
      // next();
    } catch (error) {
      // TODO - handle error
      console.log(error);
    }



  }
}

module.exports = new ElectionDB();
