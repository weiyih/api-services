'use strict'; // No undeclared variable usage

// const http = require('http');
// const readline = require('readline'); 
const express = require('express')

// SERVER CONFIG
// TODO - setup dev and deployed host:port 
const HOST = '127.0.0.1';
const PORT = 8080; 


// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

// const args = process.argv.slice(2)
// console.log(args)
// console.log(args['name'])
// // process.argv.forEach((val, index) => {
// //     console.log(`${index}: ${val}`)
// //   })

// const server = http.createServer((req,res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
//     process.exitCode = 0
// })    

// const userInput = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   })

// SIGTERM -> Gracefully terminate2
process.on('SIGTERM', () => {
    server.close(()=> {
        console.log('Process terminated')
    })
})

