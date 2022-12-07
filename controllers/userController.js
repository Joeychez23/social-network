const { User, Thought } = require('../models');
const { find } = require('../models/User');

async function getUsers(req, res) {
    try {
        const data = await User.find({})

        if(data == null) {
            res.json({ message: "No Users found" })
            return
        }
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }

}

async function getUser(req, res) {
    try {
        let foundData = true
        const data = await User.findOne({ _id: req.params.userId })
            .catch(
                function () {
                    res.json({ message: "No User found" })
                    return foundData = false
                }
            )

        if (foundData == false) {
            {
                return
            }
        }
        if(data == null) {
            res.json({ message: "No User found" })
            return
        }
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }

}


async function createUser(req, res) {
    try {

        let passedName = true;
        let passedEmail = true;

        const allData = await User.find({})
        if(allData == null) {
            res.json({ message: "No Users found" })
            return
        }

        for (let i = 0; i < allData.length; i++) {
            if (allData[i].username == req.body.username) {
                passedName = false;
            }
            if (allData[i].email == req.body.email) {
                passedEmail = false
            }

        }

        if (passedName == true && passedEmail == true) {
            const data = await User.create(req.body)
            await data.save()
            res.json(data);
            return
        }
        if (passedName == false && passedEmail == false) {
            res.json({ message: 'Both name and email are taken' })
            return

        }

        if (passedName == false) {
            res.json({ message: 'Username taken' })
            return
        }

        if (passedEmail == false) {
            res.json({ message: 'Email taken' })
            return
        }

    } catch (err) {
        res.status(500).json(err);
    }

}

async function updateUser(req, res) {
    try {
        let foundData = true
        const data = await User.findOne({ _id: req.params.userId })
            .catch(
                function () {
                    res.json({ message: "No User found" })
                    return foundData = false
                }
            )

        if (foundData == false) {
            {
                return
            }
        }
        if(data == null) {
            res.json({ message: "No User found" })
            return
        }
        // Set back to false
        let passedName = true;
        let passedEmail = true;
        const allData = await User.find({})
        if(allData == null) {
            res.json({ message: "No Users found" })
            return
        }
        for (let i = 0; i < allData.length; i++) {
            if (allData[i].username == req.body.username && allData[i]._id != req.params.userId) {
                passedName = false;
            }
            if (allData[i].email == req.body.email && allData[i]._id != req.params.userId) {
                passedEmail = false
            }

        }
        if (passedName == true && passedEmail == true) {
            data.username = req.body.username;
            data.email = req.body.email
            
            await data.save();

            const thoughtData = await Thought.find({})

            for(let i = 0; i < thoughtData.length; i++) {
                if(thoughtData[i].createdBy.toJSON() == req.params.userId) {
                    thoughtData[i].username = req.body.username;
                }
                for(let j =0; j < thoughtData[i].reactions.length; j++) {
                    if(thoughtData[i].reactions[j].createdBy.toJSON() == req.params.userId) {
                        thoughtData[i].reactions[j].username = req.body.username;
                    }
                }
            }

            for(let i =0; i < thoughtData.length; i++) {
                await thoughtData[i].save();
            }
            res.json(data);


        }
        if (passedName == false && passedEmail == false) {
            res.json({ message: 'Both name and email are taken' })
            return

        }
        if (passedName == false) {
            res.json({ message: 'Username taken' })
            return
        }
        if (passedEmail == false) {
            res.json({ message: 'Email taken' })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }

}

async function deleteUser(req, res) {
    try {
        const dataAll = await User.find({})
        if(dataAll == null) {
            res.json({ message: "No Users found" })
            return
        }
        let delFriendIndex = new Array
        for (let i = 0; i < dataAll.length; i++) {
            friendArr = dataAll[i].friends
            dataAll[i].friends = []
            for (let j = 0; j < friendArr.length; j++) {
                if (`${friendArr[j].toJSON()}` == `${req.params.userId}`) {
                    delFriendIndex[delFriendIndex.length] = i
                    //console.log(`\nfailed at data: ${i}, friends ${j}`)
                }
                if (`${friendArr[j].toJSON()}` != `${req.params.userId}`) {
                    //console.log(`\npassed at data: ${i}, friends ${j}`)
                    dataAll[i].friends[dataAll[i].friends.length] = friendArr[j]
                }
            }
        }
        for (let i = 0; i < delFriendIndex.length; i++) {
            await dataAll[delFriendIndex[i]].save()
        }

        const data = await User.deleteOne({ _id: req.params.userId });


        if (data.deletedCount != 0) {
            const thoughtData = await Thought.deleteMany({ createdBy: req.params.userId })
            res.json({ message: 'Success' })
            return

        }
        if (data.deletedCount == 0) {
            res.json({ message: 'Not Found' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}


async function addFriend(req, res) {
    try {
        let foundData = true
        const userData = await User.findOne({ _id: req.params.userId })
            .catch(
                function () {
                    res.json({ message: "No User found" })
                    return foundData = false
                }
            )
        const friendData = await User.findOne({ _id: req.params.friendId })
            .catch(
                function () {
                    res.json({ message: "No Friend found" })
                    return foundData = false
                }
            )
        if (foundData == false) {
            {
                return
            }
        }
        if(userData == null) {
            res.json({ message: "No User found" })
            return
        }
        if(friendData == null) {
            res.json({ message: "No Friend found" })
            return
        }
        let hasFriend = false
        for (let i = 0; i < userData.friends.length; i++) {
            if (`${userData.friends[i].toJSON()}` == `${friendData._id.toJSON()}`) {
                hasFriend = true
            }
        }

        if (hasFriend == true) {
            res.json({ message: "Friend already added" })
            return
        }

        if (hasFriend == false) {
            userData.friends[userData.friends.length] = friendData._id
            await userData.save();
            res.json(userData)
            return
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}


async function deleteFriend(req, res) {
    try {
        let foundData = true
        const userData = await User.findOne({ _id: req.params.userId })
            .catch(
                function () {
                    res.json({ message: "No User found" })
                    return foundData = false
                }
            )
        const friendData = await User.findOne({ _id: req.params.friendId })
            .catch(
                function () {
                    res.json({ message: "No Friend found" })
                    return foundData = false
                }
            )
        if (foundData == false) {
            {
                return
            }
        }
        if(userData == null) {
            res.json({ message: "No User found" })
            return
        }
        if(friendData == null) {
            res.json({ message: "No Friend found" })
            return
        }
        let hasFriend = false
        for (let i = 0; i < userData.friends.length; i++) {
            if (`${userData.friends[i].toJSON()}` == `${friendData._id.toJSON()}`) {
                hasFriend = true
            }
        }

        if (hasFriend == true) {
            let friendArr = userData.friends
            userData.friends = []
            for(let i = 0; i < friendArr.length; i++) {
                if(`${friendArr[i].toJSON()}` != `${friendData._id.toJSON()}`) {
                    userData.friends[userData.friends.length] = friendArr[i];
                }
            }

            await userData.save();
            res.json(userData)
            return
        }

        if (hasFriend == false) {
            res.json({ message: `User: ${userData.username} does not have ${friendData.username} in friends list to delete` })
            return
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}





module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
}