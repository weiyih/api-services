'use strict'; // No undeclared variable usage
// import express from 'express';
// import LoginController from './Controllers/LoginController';
const express = require('express');

// SERVER CONFIG
// TODO - setup dev and deployed host:port 
const HOST = '127.0.0.1';
const PORT = 8080;

// App
const app = express();
app.use(express.urlencoded())
// const loginHandler = LoginController()

app.get('/', (req, res) => {
  //DO NOTHING
});

// Login Controller
// TODO - OAuth
// TODO - Brute force attack logins
app.post('/api/login', (req, res) => {
  // loginHandler
  res.send('Login');
});

app.post('/api/submit', (req, res) => {

});

app.listen(PORT, (req, res) => {
  console.log(`Example app listening on port ${PORT}`);
})

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
  server.close(() => {
    console.log('Process terminated')
  })
})

