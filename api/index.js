import express from 'express';

const PORT = 5000;
const app = express();

app.get('/api/v1/hello', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'hellow trees'
  })
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

