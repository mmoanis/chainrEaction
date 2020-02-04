import express from 'express';
import bodyParser from 'body-parser';

import projects from './projects';
import Web3 from 'web3';
import Personal from 'web3-eth-personal';
import ganache from 'ganache-cli';
import FS from 'fs';

// address: 0x7FD984277dAbCa17B9500Cb85427eAa55e23eAFB
// privatekey: 0x0c32fb4f35c4d7309500cd958d3732f00e48966cde81e58e05389fba1ca69a0b

const web3 = new Web3('HTTP://127.0.0.1:7545');
const account = web3.eth.accounts.create();

const treeChain = new web3.eth.Contract(require('../bc/build/contracts/TreeChain.json').abi, '0x7f141D7E4400B6a282de0cBc892230bE8FBF3C4A');
// treeChain.methods.trial().call().then(console.log);

// web3.eth.personal.newAccount('hello', (error, address) => {
//   console.log(address);
//   web3.eth.personal.unlockAccount(address, 'hello', 100);
//   // console.log(
//     // treeChain.methods.addProject('0x016823EB9cc7D1D3B6974171B7977A92D90B3511', 1000, 50, 50).call()
//     // treeChain.methods.trial().call( (error, result) => {
//     //   console.log('Errror ' + error);
//     //   console.log('Result ' + result);
//     // })
//     // );
// })


// treeChain.methods.addProject('0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a', 1000, 50, 50)
// .send({from: '0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a', gas: 100000}).then(console.log);

// treeChain.methods.getGoal('0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a').call().then(console.log);

// treeChain.methods.getVerified('0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a').call().then(console.log);
// treeChain.methods.plant('0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a', 100, 50, 50)
// .send({from: '0x4E10D8Ee2FcBECE3c526Bdfc51d16DAb25c8A372', gas: 1000000}).then(console.log);
// treeChain.methods.getVerified('0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a').call().then(console.log);


// treeChain.methods.getVerified('0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a').call().then(console.log);
treeChain.methods.verify('0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a', 2, true)
.send({from: '0x4E10D8Ee2FcBECE3c526Bdfc51d16DAb25c8A372', gas: 1000000}).then(console.log);
// treeChain.methods.getVerified('0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a').call().then(console.log);


const PORT = 5000;
const app = express();
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/hello', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'hellow trees'
  });
});

// app.get('/api/v1/projects', (req, res) => {
//   res.status(200).send({
//     success: 'true',
//     projects: projects
//   });
// });

app.get('/api/v1/projects/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  projects.map((project) => {
    if (project.id === id) {
      res.status(200).send({
        success: 'true',
        project
      });
    }
  });

  return res.status(404).send({
    success: 'false',
    message: "No such project!"
  });
});

app.post('/api/v1/tree', (req, res) => {
  if (!req.body.x || !req.body.y) {
    return res.status(400).send({
      success: 'false',
      message: 'Invalid request!'
    });
  }

treeChain.methods.plant('0xE5d6b367ec0f8550e45f9E393d40298C2fA6616a', 100, 50, 50)
.send({from: '0x4E10D8Ee2FcBECE3c526Bdfc51d16DAb25c8A372', gas: 1000000}).then(console.log);
  console.log('Tree added ' + req.body);

  return res.status(201).send({
    success: 'true',
    message: 'tree added'
  });
});

app.post('/api/v1/verify', (req, res) => {
  if (!req.body.x || !req.body.y || !req.body.id || !req.body.num) {
    return res.status(400).send({
      success: 'false',
      message: 'Invalid request!'
    });
  }

  console.log('Tree verified ' + req.body);

  return res.status(201).send({
    success: 'true',
    message: 'tree verified'
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

