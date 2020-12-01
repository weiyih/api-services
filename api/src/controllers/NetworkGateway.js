const { Wallets, Gateway, Identity } = require('fabric-network');
const fs = require('fs');
const { connect } = require('http2');
const path = require('path');


class NetworkGateway {
    constructor() {
        this.gateway = new Gateway();
    }

    async initialize() {
        try {
            await this.loadIdentity();
            await this.connectGateway();
            return this.gateway;
        } catch (error) {
            console.log(error);
        }
    }

    // Loads identity from wallet

    // NOTE: itentity has already been enrolled using IBM CLoud Platoform CLI
    // If identity doesn't exist create it from the certs
    // TODO - swap to enrollUser.js to dyanmically register
    async loadIdentity() {
        try {
            // Get wallet path to load identity
            const walletPath = path.resolve(__dirname, '../config/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);

            // Returns an identity from the wallet or undefined
            const identity = await wallet.get('node-api-mobile');

            if (!identity) {
                const cert = fs.readFileSync(path.resolve(__dirname, '../src/config/wallet/node-api-mobile/certificate.pem'), 'utf8');
                const privateKey = fs.readFileSync(path.resolve(__dirname, '../src/config/wallet/node-api-mobile/private_key.pem'), 'utf8');
                // const identity = X509WalletMixin.createIdentity('node-api-mobile', cert, privateKey);
                const identity = {
                    credentials: {
                        certificate: cert,
                        privateKey: privateKey,
                    },
                    mspId: 'node-api-mobile',
                    type: 'X.509',
                };
                await wallet.put('node-api-mobile', identity);
                console.log('Successfully imported it into the wallet');
            } else {
                console.log('App identity exists');
            } 
        }catch (error) {
            console.error(`Failed to load identity: ${error}`);
        }
    }


    async connectGateway() {
        try {
            // Get wallet path to load identity
            const walletPath = path.resolve(__dirname, '../config/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);

            // Common connection profile
            const ccpPath = path.resolve(__dirname, '../config/org-city-msp_profile.json');
            const ccp = fs.readFileSync(ccpPath, 'utf8'); // Common Connection Profile
            const ccpJSON = JSON.parse(ccp);

            const gatewayOptions = {
                identity: 'node-api-mobile',
                wallet,
                discovery: { enabled: true, asLocalhost: false },
            }
            // Connect to network

            await this.gateway.connect(ccpJSON, gatewayOptions);
        } catch (error) {
            console.log('Error connecting to gateway:', error);
        }
    }
}

module.exports = NetworkGateway;