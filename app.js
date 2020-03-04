const http = require('http');
const readline = require('readline');

const hostname = '127.0.0.1';
const port = 8080;

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

const userInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })


userInput.question(`What's your name?`, name => {
    console.log(`Hi ${name}!`)
    userInput.close()
  })

// SIGTERM -> Gracefully terminate2
process.on('SIGTERM', () => {
    server.close(()=> {
        console.log('Process terminated')
    })
})

