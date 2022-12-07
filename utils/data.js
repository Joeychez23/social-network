const ObjectID = require('bson').ObjectID;


const names = [
    'inception',
    'diabolique',
    'raspberry',
    'cranberry',
    'nix',
    'notorious',
    'donut',
    'instrument',
    'pelican',
    'lastrada',
    'tennis',
    'insight',
    'heart',
    'prune',
    'diabolique',
    'thethirdman',
    'viola',
    'mercury',
    'chimpanzee',
    'polar',
    'ikiru',
    'verdant',
    'citylights',
    'taxidriver',
    'triangulum',
    'ice',
    'olive',
];

const emails = [
    'inception',
    'diabolique',
    'raspberry',
    'cranberry',
    'nix',
    'notorious',
    'donut',
    'instrument',
    'pelican',
    'lastrada',
    'tennis',
    'insight',
    'heart',
    'prune',
    'diabolique',
    'thethirdman',
    'viola',
    'mercury',
    'chimpanzee',
    'polar',
    'ikiru',
    'verdant',
    'citylights',
    'taxidriver',
    'triangulum',
    'ice',
    'olive',
];

const descriptionsBodies = [
    'How to disagree with someone',
    'iPhone review',
    'how-to video',
    'video essay on the history of video games',
    'How to make money on the App Store',
    'Learn NextJS in five minutes (Not clickbate)',
    'Movie trailer',
    'Hello world',
    'Another possible solution to the algorithm',
    'Apology video',
    'Submission for startup pitch',
];

const possibleResponses = [
    'I disagree!',
    'I tried your algorithm, here were the results',
    'This was awesome',
    'Thank you for the great content',
    'Please check out my video response',
    'Like and subscribe to my channel please',
    'Reply: The side effects of in app purchases on digital marketplaces',
];

const users = [];

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random full name
const getRandomName = () =>
    `${getRandomArrItem(names)}${getRandomArrItem(names)}`;





// Function to generate random videos that we can add to the database. Includes video responses.
const getRandomThoughts = (users) => {
    let results = [];
    for (let i = 0; i < 20; i++) {
        let user = users[Math.floor(Math.random() * users.length)]
        results.push({
            createdAt: new Date,
            thoughtText: getRandomArrItem(descriptionsBodies),
            username: user.username,
            reactions: [...getThoughtReactions(users)],
            createdBy: user._id
        });
    }
    return results;
};

// Create the responses that will be added to each video
const getThoughtReactions = (users) => {
    let results = [];
    for (let i = 0; i < Math.floor(Math.random() * users.length); i++) {
        let user = users[Math.floor(Math.random() * users.length)]
        results.push({
            reactionId: new ObjectID(),
            reactionBody: getRandomArrItem(possibleResponses),
            username: user.username,
            createdAt: new Date,
            createdBy: user._id
        });
    }
    return results;
};

// Export the functions for use in seed.js
module.exports = { getRandomName, getRandomThoughts };