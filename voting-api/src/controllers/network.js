const { Wallets, Gateway, Identity } = require('fabric-network');
const fs = require('fs');
const path = require('path');


// Loads pre-enrolled client application identity to access blockchain
async function loadIdentity() {
    try {
        // Get wallet path to load identity
        const walletPath = path.resolve(__dirname, '../config/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Returns an identity from the wallet or undefined
        const identity = await wallet.get('api-services');

        if (!identity) {
            const cert = fs.readFileSync(path.resolve(__dirname, '../config/wallet/api-services/certificate.pem'), 'utf8');
            const privateKey = fs.readFileSync(path.resolve(__dirname, '../config/wallet/api-services/private_key.pem'), 'utf8');
            const identity = {
                credentials: {
                    certificate: cert,
                    privateKey: privateKey,
                },
                mspId: 'org1msp',
                type: 'X.509',
            };
            await wallet.put('api-services', identity);
            console.log('Successfully imported identity into the wallet');
        } else {
            console.log('App identity exists');
        } 
    }catch (error) {
        console.error(`Failed to load identity: ${error}`);
    }
}


async function connectGateway() {
    try {
        const gateway = new Gateway()
        // Get wallet path to load identity
        const walletPath = path.resolve(__dirname, '../config/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Common connection profile
        const ccpPath = path.resolve(__dirname, '../config/org1msp_profile.json');
        const ccp = fs.readFileSync(ccpPath, 'utf8'); // Common Connection Profile
        const ccpJSON = JSON.parse(ccp);

        const gatewayOptions = {
            identity: 'api-services',
            wallet,
            discovery: { enabled: true, asLocalhost: false },
        }
        // Connect to network

        await gateway.connect(ccpJSON, gatewayOptions);
        // console.log('Connected to gateway');
        return gateway;
    } catch (error) {
        console.log('Error connecting to gateway:', error);
    }
}

module.exports = { connectGateway, loadIdentity }