const mongoose = require('mongoose');
const connection = require('../config/connection');
const { User, Thought } = require('../models');
const ObjectID = require('bson').ObjectID;
const { getRandomName, getRandomThoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  await Thought.deleteMany({});
  await User.deleteMany({});

  const users = [];

  for (let i = 0; i < 1000; i++) {
    const username = `test${i}`//getRandomName();

    const email = `${username}@test.com`

    let passedUsername = 0;

    let passedEmail = 0;

    for (let i = 0; i < users.length; i++) {
      if (username != users[i].username) {
        passedUsername += 1;
      }
      if (email != users[i].email) {
        passedEmail += 1;
      }
    }

    if (passedUsername == users.length && passedEmail == users.length) {
      users.push({
        _id: new ObjectID(),
        username,
        email,

      });
    } else {
      i -= 1;
    }

  }

  const thoughts = getRandomThoughts(users);

  for(let i = 0; i < thoughts.length; i++) {
    thoughts[i]._id = new ObjectID()
  }


  for (let i = 0; i < users.length; i++) {
    users[i].thoughts = new Array;
    for (let j = 0; j < thoughts.length; j++) {
      if (users[i].username == thoughts[j].username) {
        users[i].thoughts[users[i].thoughts.length] = thoughts[j]._id
        //thoughts[j].createdBy = users[i]._id
      }
    }
  }





  for (let i = 0; i < users.length; i++) {
    users[i].friends = new Array;
    friendAmount = Math.floor(Math.random() * users.length)
    for (let j = 0; j < friendAmount; j++) {
      let check = 0;
      let friendIndex = Math.floor(Math.random() * users.length)
      for (let w = 0; w < users[i].friends.length; w++) {
        if (users[friendIndex].username != users[i].friends[w].username) {
          check += 1;
        }
      }
      if (check == users[i].friends.length) {
        users[i].friends[users[i].friends.length] = users[friendIndex]._id
      }
    }
  }


  await User.collection.insertMany(users)
  await Thought.collection.insertMany(thoughts);

  // loop through the saved thoughtss, for each thoughts we need to generate a thoughts response and insert the thoughts responses
  //console.table(users);
  //console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});