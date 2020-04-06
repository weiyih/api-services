// https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.html

const { Wallets, Gateway, Transaction, TimeoutError } = require('fabric-network');


// Provides persisten reusable connection to peer within netowrk
// Access to any (Network) channel peer is member of, which provides
// access to Smart Contract
// Transaction submitted or queries evaluated

class TransactionController {
    constructor() {
        this.gateway = new Gateway(); // Gateway
        this.network = null; // Network
        this.wallet = null; // Wallet
        this.contract = null; // Contract
    }

    async init() {
        this.setupWallet();

        this.setupGateway();
        this.setupNetwork();
        this.setupContract();
    }

    // Identity setup
    setupWallet() {
        this.wallet = new Wallets.newFileSystemWallet('path to wallet') // identity of application
        // Wallet implementation
        // const identity: X509Identity = {
        //     credentials: {
        //         certificate: 'PEM format certificate string',
        //         privateKey: 'PEM format private key string',
        //     },
        //     mspId: 'wonderland',
        //     type: 'X.509',
        // };
        // await wallet.put('alice', identity);
    }

    async setupGateway() {
        // TODO - Timeout retry
        try {
            await this.gateway.connect(commonConnectionProfile, gatewayOptions)
        } catch (error) {
            console.log(error);
        }
    }

    async setupNetwork() {
        // TODO - Migrate to discovery service
        try {
            const channelName = 'election-name';
            this.network = await this.gateway.getNetwork(channelName);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async setupContract() {
        try {
            const chaincode = 'election-name-contract';
            this.contract = await this.network.getContract(chaincode);
        } catch (error) {
            console.log(error);
        }
    }

    // Cleanup and diconnect gateway
    disconnectGateway() {
        this.gateway.disconnect();
    }

    // Perform transaction
    // userVote : Vote object
    async submitTransaction(userVote) {
        let voteArgs = arg1, arg2, arg3
        try {
            const transaction = "record";
            // equivalent to createTransaction(name).submit()
            let submitResults = await this.contract.submitTransaction(transaction, voteArgs);
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
                let results = await this.contract.evaluateTransction(voteArgs)
                console.log(results);
            }
        }
    }
}
