const { User } = require('../models')

async function getUsers(req, res) {
    try {

        const data = await User.find({})
        console.log(data)
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }

}

module.exports = {
    getUsers
}