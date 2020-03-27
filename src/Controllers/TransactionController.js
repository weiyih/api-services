const { Wallets } = require('fabric-network');

// TODO - config file loading

const clientGateway = await Wallets.newFileSystemWallet(walletDirectoryPath)