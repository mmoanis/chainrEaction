import express from 'express';
import bodyParser from 'body-parser';

import projects from './projects';

const PORT = 5000;
const app = express();
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/hello', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'hellow trees'
  })
});

app.get('/api/v1/projects', (req, res) => {
  res.status(200).send({
    success: 'true',
    projects: projects
  })
});

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

