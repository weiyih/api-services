const { Wallets, Gateway } = require('fabric-network');

// TODO - config file loading

// Provides persisten reusable connection to peer within netowrk
// Access to any (Network) channel peer is member of, which provides
// access to Smart Contract
// Transaction submitted or queries evaluated
const clientGateway = Gateway()

await clientGateway.connect();