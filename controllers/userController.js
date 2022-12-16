const { User, Thought } = require('../models');

async function getUsers(req, res) {
    try {
        const data = await User.find({})

        if (data == null) {
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
        if (data == null) {
            res.json({ message: "No User found" })
            return
        }
        await data.populate('friends')


        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }

}


async function createUser(req, res) {
    try {

        let passedName = true;
        let passedEmail = true;

        const allName = await User.find({username: req.body.username})
        const allEmail = await User.find({email: req.body.email})


        if(allName.length > 0) {
            passedName = false
        }

        if(allEmail.length > 0) {
            passedEmail = false
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
        if (data == null) {
            res.json({ message: "No User found" })
            return
        }
        // Set back to false
        let passedName = true;
        let passedEmail = true;
        const allName = await User.find({username: req.body.username})
        const allEmail = await User.find({email: req.body.email})


        
        if(allName.length > 0) {
            passedName = false
        }

        if(allEmail.length > 0) {
            passedEmail = false
        }



        if (passedName == true && passedEmail == true) {
            data.username = req.body.username;
            data.email = req.body.email

            await data.save();

            res.json(data);


            await Thought.updateMany({createdBy: req.params.userId}, {$set: {username: req.body.username} });

            await Thought.updateMany({ 'reactions.createdBy': req.params.userId}, {$set: {
                'reactions.$.username': req.body.username,
            }});


            console.log('passed')
            return


        }

        if (passedName == true && passedEmail == false) {
            data.username = req.body.username;

            await data.save();

            res.json(data);

            await Thought.updateMany({createdBy: req.params.userId}, {$set: {username: req.body.username} });

            await Thought.updateMany({ 'reactions.createdBy': req.params.userId}, {$set: {
                'reactions.$.username': req.body.username,
            }});
 

            console.log('passed')
            return


        }

        if(passedName == false && passedEmail == true) {
            data.email = req.body.email;
            await data.save();
            res.json(
                { 
                message: 'Name was taken. email added',
                data: data
                }
            )
            return

        }
        if (passedName == false && passedEmail == false) {
            res.json(
                { 
                    message: 'Both name and email are taken',
                    data: data
                })
            return

        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }

}

async function deleteUser(req, res) {
    try {
        const dataAll = await User.find({'friends': { $all: [req.params.userId]}})
        if (dataAll == null) {
            res.json({ message: "No Users found" })
            return
        }

        await User.updateMany({'friends': { $all: [req.params.userId]}}, {$pull: {'friends': { $all: [req.params.userId]}}})


        const data = await User.deleteOne({ _id: req.params.userId });


        if (data.deletedCount != 0) {
            const thoughtData = await Thought.deleteMany({ createdBy: req.params.userId })
            res.json({ message: 'Success' })
            return

        }
        if (data.deletedCount == 0) {
            res.json({ message: 'Nothing availible to delete' })
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
        if (userData == null) {
            res.json({ message: "No User found" })
            return
        }
        if (friendData == null) {
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
            await userData.populate('friends')
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
        if (userData == null) {
            res.json({ message: "No User found" })
            return
        }
        if (friendData == null) {
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
            for (let i = 0; i < friendArr.length; i++) {
                if (`${friendArr[i].toJSON()}` != `${friendData._id.toJSON()}`) {
                    userData.friends[userData.friends.length] = friendArr[i];
                }
            }

            await userData.populate('friends')
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