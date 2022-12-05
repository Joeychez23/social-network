const express = require('express');
const db = require('./config/connection.js');
const routes = require('./routes');
const {User, Thought, Reaction} = require('./models')

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server for Social Network running on port ${PORT}!`);
  });
});






