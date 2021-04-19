// https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.html

const { Wallets, Gateway, TimeoutError, X509WalletMixin } = require('fabric-network');
const NetworkGatewayFactory = require('./NetworkGatewayFactory')

// Provides persisten reusable connection to peer within netowrk
// Access to any (Network) channel peer is member of, which provides
// access to Smart Contract
// Transaction submitted or queries evaluated

let key = 0;

class TransactionController {

    constructor() {
        try {
            this.gateway = NetworkGatewayFactory.create();
        } catch (error) {
          console.log(error);
        }
    }

    // Submit vote as transaction
    async submitTransaction(ballot) {


        network = await this.gateway.getNetwork('voting-channel');
        contract = this.network.getContract('vote-contract');

        let voteKey = 'VOTE' + key;
        key++;
        try {
            let submitResults = 
            
            
            await this.contract.submitTransaction('createVote', voteKey, ballot.election_id, ballot.ward, ballot.selected_candidate, ballot.timestamp);
            // TODO - 
            if (submitResults) {
                console.log(submitResults);
                // return { "result" : "success"};
                return true;
            } else {
                console.log(submitResults);
                // return { "result" : "failed"};
                return false;
            }
        } catch (error) {
            // TimeoutError if the transaction was successfully submitted to the orderer but timed out before a commit event was received from peers. 
            if (error instanceof TimeoutError) {
                // evaluate peers to see if transaction is on peers
                // TODO 
                console.log(error);
            }
        }
    }

    async queryAllVotes() {
        try {
            const result = await this.contract.submitTransaction('queryAllVotes');
            // console.log(result.toString());
            return (result.toString());
        } catch (error) {
            console.log(error);
        }
    }

    // Temp function to get/update VoteKey based on blockchain
    async updateVoteKey() {
        this.queryAllVotes()
            .then(function (result) {
                const resJSON = JSON.parse(result);
                const votesLen = resJSON.length;
                key = votesLen;
                console.log(key);
                return;
            }).catch((err) => {
                console.log(err);
            });
    }

    async readVote(voteKey) {
        try {
            // const result = await this.contract.submitTransaction('readVote', voteKey);
            const result = await this.contract.submitTransaction('readVote', 'VOTE0');
            console.log(result);
        } catch (error) {
            console.log(error);
        }

    }

    // Clean up and disconnect this Gateway connection
    disconnect() {
        this.gateway.disconnect();
    }

}

module.exports = new TransactionController();