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


const contract_address = '0x9456B0DF207Aa07Ae0DEfe819B79ae4344014eD8'
const project_address = '0x6F4171Bd300586941086F1201c41fc382510408c'
const sender_address = '0x8CeaA0E58DE227fCC7171988A9807e234843a0E4'
const sponsor_address = '0x5Bc4e9F33f6eD2DaF7eBeB0FE75d57A6CaDC79aC'
const GAS_LIMIT = 1000000;

const treeChain = new web3.eth.Contract(require('../bc/build/contracts/TreeChain.json').abi, contract_address);


async function initialize_project() {

  await treeChain.methods.addProject(project_address, 10, 99, 99)
  .send({from: sender_address, gas: GAS_LIMIT});

  await treeChain.methods.getGoal(project_address).call().then(console.log);

  console.log('Initial project balance');
  await treeChain.methods.getBalance(project_address).call().then(console.log);

  // Fill balance of sponsor
  await treeChain.methods.fillBalance(sponsor_address, 100000)
  .send({from: sender_address, gas: GAS_LIMIT});

  console.log('Sponsor balance after filling');
  await treeChain.methods.getBalance(sponsor_address).call().then(console.log);

  // Sponsor project
  await treeChain.methods.sponsor(project_address, 99999)
  .send({from: sponsor_address, gas: GAS_LIMIT});

  console.log('Sponsor balance after sponsoring');
  await treeChain.methods.getBalance(sponsor_address).call().then(console.log);

  console.log('Project balance after sponsoring');
  await treeChain.methods.getBalance(project_address).call().then(console.log);


  // Trust sender as verifier
  await treeChain.methods.setVerifier(sender_address, 1000)
  .send({from: sender_address, gas: GAS_LIMIT});
  
  
  // await treeChain.methods.verify(project_address, 1, true)
  // .send({from: sender_address, gas: GAS_LIMIT});
  
  // await treeChain.methods.getVerified(project_address).call().then(console.log);

  
  // await treeChain.methods.plant(project_address, 9, 99,  99)
  // .send({from: sender_address, gas: GAS_LIMIT});

  // await treeChain.methods.getVerified(project_address).call().then(console.log);

  // await treeChain.methods.verify(project_address, 5, true)
  // .send({from: sender_address, gas: GAS_LIMIT});
  
  // await treeChain.methods.getVerified(project_address).call().then(console.log);

  // await treeChain.methods.getVerifier(sender_address).call().then(console.log);

  // await treeChain.methods.getBalance(sender_address).call().then(console.log);

  // await treeChain.methods.getScore(project_address, 7).call().then(console.log);

  // await treeChain.methods.getScore(project_address, 5).call().then(console.log);

  // await treeChain.methods.getScore(project_address, 0).call().then(console.log);

  // await treeChain.methods.getBalance(project_address).call().then(console.log);


}

initialize_project();


async function plantTrees(project, n_trees, x, y, sender) {
  await treeChain.methods.plant(project, n_trees, x, y)
  .send({from: sender, gas: GAS_LIMIT});
}

async function verifyTrees(project, tree_id, existing, sender) {
  await treeChain.methods.verify(project, tree_id, existing)
  .send({from: sender, gas: GAS_LIMIT});
}


 
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
  
  //pass project address. Are req.x req.y  cooordinates??
  plantTrees(project_address, 1, req.body.x, req.body.y, sender_address) 
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

  // Existing option??!
  const tree_id = 0;
  verifyTrees(project_address, tree_id, existing, sender_address);
  console.log('Tree verified ' + req.body);

  return res.status(201).send({
    success: 'true',
    message: 'tree verified'
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

