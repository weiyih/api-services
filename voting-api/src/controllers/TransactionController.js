// https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.html

const { Wallets, Gateway, TimeoutError, X509WalletMixin, TxEventHandler, TxEventHandlerFactory } = require('fabric-network');
const { connectGateway } = require('./network');
// const NetworkGatewayFactory = require('./NetworkGatewayFactory')

// Provides persisten reusable connection to peer within netowrk
// Access to any (Network) channel peer is member of, which provides
// access to Smart Contract

let gateway;

// Transaction submitted or queries evaluated

// Submit vote as transaction
async function submitTransaction(ballot, channel) {
    try {
        gateway = await connectGateway()
        const network = await gateway.getNetwork(channel)
        const contract = network.getContract('ballot-contract');
        // Evaulate transaction on peers before submitted to the ordering service for commit to ledger

        console.log(ballot);
        
        let submitResult = await contract.submitTransaction('CreateBallot',
            [ ballot.voter_id,
            ballot.election_id,
            ballot.district_id,
            ballot.candidate_id,
            ballot.timestamp ]
        )
        // Ensure ballot can be queried
        // let result = await contract.evaluateTransaction('ReadBallot', ballot.voter_id);
        return submitResult;
        // // ContractListener
        // const listener = async (event) => {
        //     console.log('chaincodeId', event.chaincodeId.toString())
        //     console.log('eventName:', event.eventName.toString())
        //     console.log('payload:', event.paylod.toString('utf8'))
        //     // if (event.eventName === 'newOrder') {
        //     //     const details = event.payload.toString('utf8');
        //     //     // Run business process to handle orders
        //     // }
        //     contract.removeContractListner(listener);
        // }
        // contract.addContractListener(listener);
    } catch (error) {
        console.log(error)
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

// Clean up and disconnect this Gateway connection
function disconnect() {
    gateway.disconnect();
}


module.exports = { submitTransaction }; 