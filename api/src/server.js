const https = require('https');
const http = require('http');
const app = require('./app');
const fs = require('fs');
const Transaction = require('./controllers/TransactionController');
const path = require('path');

// Initialize the connections to DB and Blockchain
const PORT = 8080;

// Using self-signed cert for SSL due to lack of domain name
// Migrate to certbot for CA generation with domain name
// const serverOptions = {
//   key: fs.readFileSync(path.resolve(__dirname, './config/server-key.pem')),
//   cert: fs.readFileSync(path.resolve(__dirname, './config/server-cert.pem')),
// }

const server = http.createServer(app);
//  const server = https.createServer({serverOptions}, app);
server.listen(PORT, () => {
  console.log('Listening on HTTP port ' + PORT);
});