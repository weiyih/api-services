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

    setup() {
        setupWallet();
        connectGateway();
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
        await this.gateway.connect(commonConnectionProfile, gatewayOptions)
    }

    async setupNetwork() {
        // TODO - Migrate to discovery service
        const channelName = 'channelName';
        this.network = await this.gateway.getNetwork(channelName);
    }

    setupContract() {
        const chaincodeId = '';
        this.network.getContract(chaincodeId);
    }

    // Cleanup and diconnect gateway
    disconnectGateway() {
        this.gateway.disconnect();
    }

    // Perform transaction
    // userVote : Vote object
    async submitTransaction(userVote) {

        // let vote = JSON.parse(userVote);  //TODO - Move to app.js
        const transactionName = "record";

        try {
            // equivalent to createTransaction(name).submit()
            await this.contract.submitTransaction(transactionName)
        
        // Throws TimeoutError if the transaction was successfully submitted to the orderer but timed out before a commit event was received from peers. 
        } catch(TimeoutError) {
            await this.contract.evaluateTransction(vote)
        }

    }


}
