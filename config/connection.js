const { connect, connection } = require('mongoose');
const DB_NAME = 'socialThoughtsData'
const URI = `mongodb+srv://mydb:testval@Cluster0.haknbyf.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;