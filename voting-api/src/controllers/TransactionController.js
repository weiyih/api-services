// https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.html

const { Wallets, Gateway, TimeoutError, X509WalletMixin, TxEventHandler, TxEventHandlerFactory } = require('fabric-network');
const { connectGateway } = require('./network');
const { v4 } = require('uuid')
// const NetworkGatewayFactory = require('./NetworkGatewayFactory')

// Provides persisten reusable connection to peer within netowrk
// Access to any (Network) channel peer is member of, which provides
// access to Smart Contract

function prettyJSONString(inputString) {
    return JSON.parse(inputString);
}

/*
* Submit vote as transaction to the blockchain network
* Attempt to submit followed by a query to ensure ballot is commited
*/ 
async function submitBallotTransaction(ballot, channelName, contractName) {
    const gateway = await connectGateway()
    const network = await gateway.getNetwork(channelName)
    const contract = network.getContract(contractName);

    // Parse out ballot information
    const voter_id = ballot.id;
    const election_id = ballot.election_id
    const district_id = ballot.district_id
    const candidate_id = ballot.candidate_id
    const timestamp = ballot.timestamp

    try {
        // submitTransaction - Evaulates transaction on peers before submitting to the ordering service for commit to ledger
        // NOTES: Assumes all votes submitted will be unique and successful
        // TODO - Refactor to handle TimeoutErrors, and parse out blockchain errors
        // Blockchain errors include unable to read world state, or ballot already exists
        // Requires refactoring of chaincode and research on the best strategy to parse out errors as it is a string message
        await contract.submitTransaction('CreateBallot', voter_id, election_id, district_id, candidate_id, timestamp)
        let query = await contract.evaluateTransaction('ReadBallot', voter_id);
        const result = prettyJSONString(query.toString())
        return result;
    } catch (error) {
        // Possible errors
        // 1. TimeoutError - fabric
        // 2. ballot already exists, cannot read world state, connection errors - blockchain
        if (error instanceof TimeoutError) {
            throw Error('transaction timed out')
        } else {
            throw Error('unable to process ballot')
        }
    }
    finally {
        gateway.disconnect()
    }
}

/*
* Query vote as transaction to the blockchain network
* Returns the ballot object
*/ 
async function queryBallotExist(user, channelName, contractName) {
    console.log('querying ballot')
    const gateway = await connectGateway()
    const network = await gateway.getNetwork(channelName)
    const contract = network.getContract(contractName);

    const voterId = user.voter_id
    try {
        let query = await contract.evaluateTransaction('ReadBallot', voterId);
        const result = prettyJSONString(query.toString())
        return result;
    } catch (error) {
        // TODO - Fix error messages on blockchain to respond with actual errors instead of error string
        // Possible errors
        // 1. TimeoutError - fabric
        // 2. ballot does not exists - blockchain
        if (error instanceof TimeoutError)
            throw Error('transaction timed out')
        else {
            throw Error('ballot does not exists')
        }
    } finally {
        gateway.disconnect()
    }
}

async function queryAllBallot(channelName, contractName) {
    const gateway = await connectGateway()
    const network = await gateway.getNetwork(channelName)
    const contract = network.getContract(contractName);

    try {
        let query = await contract.evaluateTransaction('GetAllBallots');
        const result = prettyJSONString(query.toString())
        return result;
    } catch (error) {
        throw Error(error.message)   
    } finally {
        gateway.disconnect()
    }
}

module.exports = { submitBallotTransaction, queryBallotExist, queryAllBallot };