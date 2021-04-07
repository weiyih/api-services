// init-mongo.js
// Seed the voter, election, and voting databases with mock data for testing

db.auth('vsadmin', 'votingsystem');
userDB = db.getSiblingDB('user')
voterDB = db.getSiblingDB('voter')
electionDB = db.getSiblingDB('election')

// Mock User
userDB.user.createIndex({ userId: 1 })
userDB.user.createIndex({ email: 1 })
userDB.user.insert({
    user_id: '222078a2-054e-4cc0-b8ae-c0693eadbafb',
    first_name: 'Kevin',
    middle_name: '',
    last_name: 'Wei',
    email: 'weiyih@sheridancollege.ca',
    email_status: 'Verified',
    password: 'password',
    biometricPassword: 'biometric',
    voter_id: '3b241101-e2bb-4255-8caf-4136c566a962',
    date_create: '2020-01-01T00:00:00Z',
    device_id: '',
    driver_license: 'W2247-79009-10131',
    __v: 0 
    // verified
})

// Mock Voter associated with User
voterDB.voter.createIndex({ voter_id: 1 }, { unique: true })
voterDB.voter.insert({
    voter_id: '3b241101-e2bb-4255-8caf-4136c566a962',
    first_name: 'Kevin',
    middle_name: '',
    last_name: 'Wei',
    date_birth: '1991-01-31',
    unit_number: '',
    street_number: '1430',
    street_name: 'Trafalgar',
    street_suffix: 'Rd',
    town: 'Oakville',
    zip_code: 'L6H2L1',
    vote: [
        {election_id: '9cd5f582-75e5-4bee-b451-e5417c18e761', district_id: 1},
        {election_id: '7cdbe69c-5d3e-4a1c-a89e-e5d06b28c1b4', district_id: 2},
        {election_id: 'c88aeee1-134b-403c-bc37-651a890548c0', district_id: 1},
    ],
    vote_status: [
        {election_id: '9cd5f582-75e5-4bee-b451-e5417c18e761', status: 0},
        {election_id: '7cdbe69c-5d3e-4a1c-a89e-e5d06b28c1b4', status: 0},
        {election_id: 'c88aeee1-134b-403c-bc37-651a890548c0', status: 0},
    ],
    vote_online: 1,
    verified: {
        verify_code: '123456',
        status: 1,
    },
    __v: 0
})

// Election DB

electionUUID = UUID()
electionDB.election.createIndex({ election_id: 1 }, { unique: true })
electionDB.election.insert({
    election_id: '9cd5f582-75e5-4bee-b451-e5417c18e761',
    election_name: 'Oakville Municipal Election 2022',
    election_description: 'The Town of Oakville Municipal Mayoral Election for 2022.',
    election_start_date: '2021-03-01T00:00:00.000Z',
    election_end_date: '2022-01-01T00:00:00.000Z',
    advanced_polling: true,
    advanced_start_date: '2020-01-01T00:00:00.000Z',
    advanced_end_date: '2020-12-31T24:00:00.000Z',
    created_at: '2020-01-01T00:00:00.000Z',
    updated_at: '2020-02-01T00:00:00.000Z',
    locked: 0, 
    progress: 0,
    disabled: 1,
    channel_name: 'oakville-municipal-election-2022',
    contract_name: 'voting_contract',
    __v: 0
})

electionDB.election.insert({
    election_id: '63ba80e0-cae8-44a6-8a78-7ebe898e3351',
    election_name: 'Test Election 2020',
    election_description: 'The Test Election for Blockchain Voting Capstone',  
    election_start_date: '2020-03-01T00:00:00.000Z',
    election_end_date: '2021-01-01T00:00:00.000Z',
    advanced_polling: true,
    advanced_start_date: '2020-01-01T00:00:00.000Z',
    advanced_end_date: '2020-12-31T24:00:00.000Z',
    created_at: '2020-01-01T00:00:00.000Z',
    updated_at: '2020-02-01T00:00:00.000Z',
    locked: 1, // 0 - unlocked(editable), 1 - locked(not running/in progress/completed)
    progress: 0, // 0 - not running, 1 - in progress, 2 - completed
    disabled: 1, // 0 - deleted election, 1 - valid election
    channel_name: 'test-election-2020',
    contract_name: 'voting_contract',
    __v: 0
})

electionDB.election.insert({
    election_id: 'c88aeee1-134b-403c-bc37-651a890548c0',
    election_name: 'No Advanced Polling Election 2020',
    election_description: 'No Advanced Polling for Blockchain Voting Capstone',  
    election_start_date: '2020-03-01T00:00:00.000Z',
    election_end_date: '2021-01-01T00:00:00.000Z',
    advanced_polling: false,
    advanced_start_date: '',
    advanced_end_date: '',
    created_at: '2020-01-01T00:00:00.000Z',
    updated_at: '2020-02-01T00:00:00.000Z',
    locked: 1, // 0 - unlocked(editable), 1 - locked(not running/in progress/completed)
    progress: 0, // 0 - not running, 1 - in progress, 2 - completed
    disabled: 1, // 0 - deleted election, 1 - valid election
    channel_name: 'test-election-2020',
    contract_name: 'voting_contract',
    __v: 0
})

electionDB.election.insert({
    election_id: 'c88aeee2-134b-403c-bc37-651a890548c1',
    election_name: 'User Disabled Election 2020',
    election_description: 'No Advanced Polling for Blockchain Voting Capstone',  
    election_start_date: '2020-03-01T00:00:00.000Z',
    election_end_date: '2021-01-01T00:00:00.000Z',
    advanced_polling: false,
    advanced_start_date: '',
    advanced_end_date: '',
    created_at: '2020-01-01T00:00:00.000Z',
    updated_at: '2020-02-01T00:00:00.000Z',
    locked: 1, // 0 - unlocked(editable), 1 - locked(not running/in progress/completed)
    progress: 0, // 0 - not running, 1 - in progress, 2 - completed
    disabled: 1, // 0 - deleted election, 1 - valid election
    channel_name: 'test-election-2020',
    contract_name: 'voting_contract',
    __v: 0
})


// Insert ballot for Test Election
electionDB.candidates.insert({
    election_id: 'c88aeee1-134b-403c-bc37-651a890548c0',
    districts: [{
        district_id: 1,
        candidates: [{
            candidate_id: '2d8248ab-a831-4b5c-a3b2-6c5ef317731a',
            candidate_name: 'Gwen Stacy'
        },
        {
            candidate_id: '4610567e-8f6c-4c8a-acfd-5b92cfaf0766',
            candidate_name: 'Peter Parker'
        },
        {
            candidate_id: '007d60e9-8942-463a-9264-37bc9190ef04',
            candidate_name: 'Mary Jane'
        },
    ]},
    {
        district_id: 2,
        candidates: [{
                candidate_id: '7cdbe69c-5d3e-4a1c-a89e-e5d06b28c1b4',
                candidate_name: 'Lex Luthor'
            },
            {
                candidate_id: '37326dac-3dc3-4c66-9523-cb64bd1cc959',
                candidate_name: 'Mr. Freeze'
            },
            {
                candidate_id: '8ee1f294-f4a3-43c6-be75-0edc74d79952',
                candidate_name: 'Dr. Octavius'
            }
        ]
    }],
    __v: 0
})
// Insert ballot for Oakville Election
electionDB.candidates.insert({
    election_id: '9cd5f582-75e5-4bee-b451-e5417c18e761',
    districts: [{
        district_id: 1,
        candidates: [{
            candidate_id: '2d8248ab-a831-4b5c-a3b2-6c5ef317731a',
            candidate_name: 'Tony Stark'
        },
        {
            candidate_id: '4610567e-8f6c-4c8a-acfd-5b92cfaf0766',
            candidate_name: 'Steve Rogers'
        },
        {
            candidate_id: '007d60e9-8942-463a-9264-37bc9190ef04',
            candidate_name: 'Bruce Banner'
        },
    ]},
    {
        district_id: 2,
        candidates: [{
                candidate_id: '7cdbe69c-5d3e-4a1c-a89e-e5d06b28c1b4',
                candidate_name: 'Selina Kyle'
            },
            {
                candidate_id: '37326dac-3dc3-4c66-9523-cb64bd1cc959',
                candidate_name: 'Jean Grey'
            },
            {
                candidate_id: '8ee1f294-f4a3-43c6-be75-0edc74d79952',
                candidate_name: 'Carol Danvers'
            }
        ]
    }],
    __v: 0
})