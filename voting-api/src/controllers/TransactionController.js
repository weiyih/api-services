// https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.html

const { Wallets, Gateway, TimeoutError, X509WalletMixin, TxEventHandler, TxEventHandlerFactory } = require('fabric-network');
const { connectGateway } = require('./network');
// const NetworkGatewayFactory = require('./NetworkGatewayFactory')

// Provides persisten reusable connection to peer within netowrk
// Access to any (Network) channel peer is member of, which provides
// access to Smart Contract

function prettyJSONString(inputString) {
    return JSON.parse(inputString);
}

// Submit vote as transaction
async function submitBallotTransaction(ballot, channel) {
    const gateway = await connectGateway()
    const network = await gateway.getNetwork(channel)
    const contract = network.getContract('ballot-contract');

    // Parse out ballot information
    const voter_id = ballot.id
    const elec_id = ballot.election_id
    const dist_id = ballot.district_id
    const cand_id = ballot.candidate_id
    const timestamp = ballot.timestamp

    try {
        // submitTransaction - Evaulates transaction on peers before submitting to the ordering service for commit to ledger
        // NOTES: Assumes all votes submitted will be unique and successful
        // TODO - Refactor to handle TimeoutErrors, and parse out blockchain errors
        // Blockchain errors include unable to read world state, or ballot already exists
        // Requires refactoring of chaincode and research on the best strategy to parse out errors as it is a string message
        await contract.submitTransaction('CreateBallot', voter_id, elec_id, dist_id, cand_id, timestamp)
		let query = await contract.evaluateTransaction('ReadBallot',voter_id);
        const result = prettyJSONString(query.toString())
        return result;
    } catch (error) {
        if (error.message == 'the ballot does not exist' ) {
            throw Error('ballot exists')
        } else {
            console.log(error)
            throw Error('unable to process ballot')  
        }      
    } finally {
        gateway.disconnect()
    }
}


// async queryAllVotes() {
//     try {
//         const result = await this.contract.submitTransaction('queryAllVotes');
//         // console.log(result.toString());
//         return (result.toString());
//     } catch (error) {
//         console.log(error);
//     }
// }

module.exports = { submitBallotTransaction };