// https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.html

const { FileSystemWallet, Gateway, TimeoutError, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Provides persisten reusable connection to peer within netowrk
// Access to any (Network) channel peer is member of, which provides
// access to Smart Contract
// Transaction submitted or queries evaluated

let key = 0;

class TransactionController {
    // TODO - Replace key with better index


    constructor() {
        this.gateway = new Gateway(); // Gateway
        this.network = null; // Network
        this.wallet = null; // Wallet
        this.contract = null; // Contract

    }

    // Connect to blockchain network
    async setup() {
        try {
            // Load App identity
            const walletPath = path.resolve(__dirname, '../config/wallet');
            this.wallet = new FileSystemWallet(walletPath);

            const identity = await this.wallet.exists('voting-api-client');
            // Create identity if it doesn't exist
            // TODO - Migrate to registration service for security
            if (!identity) {
                const cert = fs.readFileSync(path.resolve(__dirname, '../src/config/wallet/voting-api-client/certificate.pem'));
                const privateKey = fs.readFileSync(path.resolve(__dirname, '../src/config/wallet/voting-api-client/private_key.pem'));
                let appIdentity = X509WalletMixin.createIdentity('voting-sheridan', cert, privateKey);
                await this.wallet.import('voting-api-client', appIdentity);
            } else {
                console.log('App identity exists');
            }

            // Common connection profile
            const ccpPath = path.resolve(__dirname, '../config/org_profile.json');
            const ccp = fs.readFileSync(ccpPath, 'utf8'); // Common Connection Profile
            const ccpJSON = JSON.parse(ccp);

            let wallet = this.wallet
            const gatewayOptions = {
                identity: 'voting-api-client',
                wallet,
                discovery: { enabled: true, asLocalhost: false },
            }
            // Connect to network
            await this.gateway.connect(ccpJSON, gatewayOptions);
            // Get the network (channel) our contract is deployed to.
            this.network = await this.gateway.getNetwork('voting-channel');
            // Get the contract from the network.
            this.contract = this.network.getContract('vote-contract');

            return;
        } catch (error) {
            if (error instanceof TimeoutError) {
                // TODO: Recheck query
            } else {
                console.log(error);
            }
        }
    }

    // Submit vote as transaction
    // userVote : Vote object
    async submitTransaction(ballot) {
        let voteKey = 'VOTE' + key;
        this.key++;
        try {
            let submitResults = await this.contract.submitTransaction('createVote', voteKey, ballot.election_id, ballot.ward, ballot.selected_candidate, ballot.timestamp);
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
            // const result = await contract.submitTransaction('readVote', 'VOTE0');
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
