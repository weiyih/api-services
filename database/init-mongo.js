db.auth('vsadmin', 'votingsystem');

userDB = db.getSiblingDB("voting")
voterDB = db.getSiblingDB("voter")
electionDB = db.getSiblingDB("election")

// Mock User
userDB.user.createIndex({ userId: 1 }, { unique: true })
userDB.user.createIndex({ email: 1 })
userDB.user.insert({
    user_id: UUID(),
    full_name: {
        first_name: "Kevin",
        middle_name: "",
        last_name: "Wei"
    },
    email: "weiyih@sheridancollege.ca",
    email_status: "Verified",
    voter_id: "'3b241101-e2bb-4255-8caf-4136c566a962",
    date_create: new Timestamp(),
    device_id: "",
})

// Mock Voter associated with User
voterDB.voter.createIndex({ voter_id: 1 }, { unique: true })
voterDB.voter.insert({
    voter_id: "'3b241101-e2bb-4255-8caf-4136c566a962",
    first_name: "Kevin",
    middle_name: "",
    last_name: "Wei",
    date_birth: "1991-01-31",
    street_number: "1430",
    street_name: "Trafalgar",
    street_suffix: "Rd",
    town: "Oakville",
    zip_code: "L6H2L1",
    ward: 1,
    vote_status: "No",
    vote_online: "No",
})

// Election DB
electionUUID = UUID()
electionDB.election.createIndex({ election_id: 1 }, { unique: true })
electionDB.election.insert({
    election_id: electionUUID,
    election_name: "Oakville Municipal Election 2020",
    election_start_date: "2020-01-01T00:00:00-05:00",
    election_end_date: "2020-12-31T24:00:00-05:00",
    advanced_polling: true,
    advanced_start_date: "2020-01-01T00:00:00-05:00",
    advanced_end_date: "2020-12-31T24:00:00-05:00",
})

// Ballot
electionDB.candidates.insert({
    election_id: electionUUID,
    ward: 1,
    candidate: [
        {
            candidate_id: "2d8248ab-a831-4b5c-a3b2-6c5ef317731a",
            candidate_name: { last_name: "Hawes", first_name: "Lena" }
        },
        {
            candidate_id: "4610567e-8f6c-4c8a-acfd-5b92cfaf0766",
            candidate_name: { last_name: "Bartlett", first_name: "Stanley" }
        },
        {
            candidate_id: "8ee1f294-f4a3-43c6-be75-0edc74d79952",
            candidate_name: { last_name: "Goodman", first_name: "Faizah" }
        },
        {
            candidate_id: "007d60e9-8942-463a-9264-37bc9190ef04",
            candidate_name: { last_name: "Cisneros", first_name: "Rianna" }
        },
        {
            candidate_id: "bacfbb4b-c5c8-4209-9528-0db0760b9cd7",
            candidate_name: { last_name: "Wilkinson", first_name: "Ned" }
        }
    ]
})
