// https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.html

const { Wallets, Gateway, Transaction, TimeoutError } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Provides persisten reusable connection to peer within netowrk
// Access to any (Network) channel peer is member of, which provides
// access to Smart Contract
// Transaction submitted or queries evaluated

class TransactionController {


    // Check wallet for existing app identity
    // TODO: Migrate to app registration/enrollment with CA for better security
    // console.log(gateway);



    // // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('voting-channel');
    // // Get the contract from the network.
    const contract = network.getContract('vote-contract');



    constructor() {
        this.gateway = new Gateway();; // Gateway
        this.network = null; // Network
        this.wallet = null; // Wallet
        this.contract = null; // Contract

        const ccpPath = path.resolve(__dirname, '../src/config/org_profile.json');
        const ccp = fs.readFileSync(ccpPath, 'utf8'); // Common Connection Profile
        this.ccpJSON = JSON.parse(ccp)

    }

    async init() {
        this.setupWallet();
        this.setupGateway();
        this.setupNetwork();
        this.setupContract();
    }

    // Identity setup
    async setupWallet() {

        const walletPath = path.resolve(__dirname, '../src/config/wallet');
        thiswallet = new FileSystemWallet(walletPath);

        const walletPath = path.resolve(__dirname, '../config/voting-api-client_identity.json');
        this.wallet = new Wallets.newFileSystemWallet(walletPath) // identity of application

        const identity = await wallet.exists('voting-api-client');
        if (!identity) {
            const cert = fs.readFileSync(path.resolve(__dirname, '../src/config/wallet/voting-api-client/certificate.pem'));
            const private = fs.readFileSync(path.resolve(__dirname, '../src/config/wallet/voting-api-client/private_key.pem'));
            let appIdentity = X509WalletMixin.createIdentity('voting-sheridan', cert, private);
            await wallet.import('voting-api-client', appIdentity);
        } else {
            console.log('App identity exists');
        }



    }

    async setupGateway() {
        const gatewayOptions = {
            identity: 'voting-api-client',
            wallet,
            discovery: { enabled: true, asLocalhost: false },
        }

        try {
            await gateway.connect(ccpJSON, gatewayOptions);
        }
        catch (error) {
            console.log(error);
        }
    }

    async setupNetwork() {
        // TODO - Migrate to discovery service
        try {
            const channelName = 'voting-channel';
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
    async submitTransaction(ballot) {
        try {
	        await contract.submitTransaction('createVote', key, ballot.election_id,  ballot.ward, ballot.selected_candidate, ballot.timestamp);
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

    // Clean up and disconnect this Gateway connection
	disconnect() {
		this.gateway.disconnect();
	}
	
}

module.exports = TransactionController;


// const UserDB = require('./controllers/UserDBController');


// // UserDB.loadUser('222078a2-054e-4cc0-b8ae-c0693eadbafb')
// // .then(res => {
// //     console.log(res);
// // })


// const user = {
// 	"first_name": "Test",
// 	"middle_name": "",
// 	"last_name": "Test",
// 	"date_of_birth": "2001-01-31",
// 	"email": "test@test.ca",
// 	"device_id": "",
// 	"driver_license": "W2247-79009-10131"
// }

// UserDB.createUser(user, 'placeholder').then(res => {
//     // console.log(res);
// })

// https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.html

const { FileSystemWallet, Gateway, Transaction, TimeoutError, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');


async function main() {
    try {
        c

        const ballot = {
            'election_id': '9cd5f582-75e5-4bee-b451-e5417c18e761',
            'ward': '1',
            'selected_candidate': '2d8248ab-a831-4b5c-a3b2-6c5ef317731a',
            'timestamp': String(Date.now()),
        }

        // for (let i = 2; i < 50; i++) {
        // 	const key = 'VOTE' + i
        // 	await contract.submitTransaction('createVote', key, ballot.election_id,  ballot.ward, ballot.selected_candidate, ballot.timestamp);
        // }

        // await contract.submitTransaction('createVote', key, ballot.election_id,  ballot.ward, ballot.selected_candidate, ballot.timestamp);
        const result = await contract.submitTransaction('queryAllVotes', 'VOTE0');
        // const result = await contract.submitTransaction('readVote', 'VOTE0');
        console.log(result.toString());

    } catch (error) {
        if (error instanceof TimeoutError) {
            // TODO: Recheck query
        } else {
            console.log(error);
        }
    }

}

main();
