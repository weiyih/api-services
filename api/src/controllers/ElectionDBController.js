const DBFactory = require("./DBFactory");
const electionSchema = require("../schemas/Election");
const ballotSchema = require("../schemas/Ballot");
const mongoose = require("mongoose");

require("dotenv").config();

// Models
let Election;
let Ballot;

class ElectionDB {
  constructor() {

    const { ELECTION_DB } = process.env;

    try {
      const db = DBFactory.create(ELECTION_DB);
      // Buffer registering models
      db.conn.on("connected", () => {
        console.log(`Registering ${ELECTION_DB} models`)
        Election = db.conn.model("election", electionSchema, "election");
        Ballot = db.conn.model("ballot", ballotSchema, "candidates");
      })

    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Retrieve all valid elections
   */
  async getElection(req, res, next) {
    // Build query
    
    const query = Election.find().where("disabled").equals(1);
    // .where('election_end_date').gt()

    try {
      const data = await query.exec();

      // Remove mongodb object_id(_id) and version(_v)
      const jsonData = JSON.stringify(data, (key,value) => {
        if (key === '_id' || key === "__v") {
          return undefined;
        } return value;
      });
      res.json(JSON.parse(jsonData));
      // next();
    } catch (error) {
      // TODO - handle error
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  }

  // /**
  //  * Retrieves ballots based on electionId
  //  * @param {*} electionId
  //  * TODO - Refactor to allow for multiple elections and multiple wards
  //  */
  // async getBallots(electionId) {
  async getBallots(req, res, next) {
    const query = Ballot.findOne({ election_id: electionId });
res.json
    try {

      const res = await query.exec();

      const jsonData = JSON.stringify(data, (key,value) => {
        if (key === '_id' || key === "__v") {
          return undefined;
        } return value;
      });
      res.json(JSON.parse(jsonData));
    } catch (error) {
      // TODO - handle error
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = new ElectionDB();
