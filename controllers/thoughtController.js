const { User, Thought, Reaction } = require('../models');
const { find } = require('../models/User');
const ObjectID = require('bson').ObjectID;

async function getThoughts(req, res) {
    try {

        const data = await Thought.find({})
        if (data == null) {
            res.json({ message: "No thoughts found" })
            return
        }
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }

}

async function getThought(req, res) {
    try {

        const data = await Thought.findOne({ _id: req.params.thoughtId })
        if (data == null) {
            res.json({ message: "No thought found" })
            return
        }
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }

}


async function createThought(req, res) {
    try {
        const userData = await User.findOne({ _id: req.body.createdBy }).catch(function (err) {
            res.json({ message: 'No User Found' })
            return
        })
        if (userData == null) {
            res.json({ message: "No User found" })
            return
        }
        const username = userData.username
        const data = await Thought.create({
            thoughtText: req.body.thoughtText,
            createdAt: new Date,
            username: username,
            createdBy: req.body.createdBy,
            reactions: []

        })
        await data.save()

        userData.thoughts[userData.thoughts.length] = data._id

        await userData.save();
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }

}


async function updateThought(req, res) {
    try {

        let foundData = true
        const data = await Thought.findOne({ _id: req.params.thoughtId })
            .catch(
                function () {
                    res.json({ message: "No thought found" })
                    return foundData = false
                }
            )

        if (foundData == false) {
            {
                return
            }
        }

        if(data == null) {
            res.json({ message: "No thought found" })
            return
        }

        const userData = await User.findOne({ _id: data.createdBy });



        if (req.body.createdBy == null && userData != null) {
            data.thoughtText = req.body.thoughtText;
            await data.save();
            res.json(data);
            return
        }

        if (req.body.createdBy != null) {
            foundData = true
            let sameUser = false
            const userData2 = await User.findOne({ _id: req.body.createdBy })
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

            if(userData2 == null) {
                res.json({ message: "No User found" })
                return
            }


            if (`${userData._id.toJSON()}` == `${userData2._id.toJSON()}`) {
                sameUser = true
            }

            if (sameUser == true) {
                data.thoughtText = req.body.thoughtText;
                await data.save();
                res.json(data);
                return
            }

            if (sameUser == false) {
                let thoughtArr = userData.thoughts
                userData.thoughts = [];
                for (let i = 0; i < thoughtArr.length; i++) {
                    if (`${thoughtArr[i].toJSON()}` != `${req.params.thoughtId}`) {
                        userData.thoughts[userData.thoughts.length] = thoughtArr[i]
                    }
                }

                userData2.thoughts[userData2.thoughts.length] = req.params.thoughtId;


                data.thoughtText = req.body.thoughtText;
                data.username = userData2.username;
                data.createdBy = userData2._id

                await userData.save()
                await userData2.save()
                await data.save()
                res.json(data);
                return
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }

}



async function deleteThought(req, res) {
    try {

        let foundData = true
        const data = await Thought.findOne({ _id: req.params.thoughtId })
            .catch(
                function () {
                    res.json({ message: "No Thought found" })
                    return foundData = false
                }
            )
        if (foundData == false) {
            {
                return
            }
        }
        if(data == null) {
            res.json({ message: "No thought found" })
            return
        }
        await Thought.deleteOne({ _id: req.params.thoughtId })

        const userData = await User.findOne({ _id: data.createdBy })

        let thoughtArr = userData.thoughts
        userData.thoughts = [];
        for (let i = 0; i < thoughtArr.length; i++) {
            if (`${thoughtArr[i].toJSON()}` != `${req.params.thoughtId}`) {
                userData.thoughts[userData.thoughts.length] = thoughtArr[i]
            }
        }

        await userData.save()

        res.json({ message: "Success" })
        return

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}


async function createReaction(req, res) {
    try {
        if (req.body.createdBy == null) {
            res.json({ message: 'Add a createdBy: user: _id to the json body' })
            return
        }

        if (req.body.reactionBody == null) {
            res.json({ message: 'Add a content to the reactionBody in the json body' })
            return
        }

        if (req.body.createdBy != null && req.body.reactionBody != null) {
            let foundData = true
            const thoughtData = await Thought.findOne({ _id: req.params.thoughtId }).catch(
                function () {
                    res.json({ message: "No thought found" })
                    return foundData = false
                }
            )


            const userData = await User.findOne({ _id: req.body.createdBy }).catch(
                function () {
                    res.json({ message: "No user found" })
                    return foundData = false
                }
            )

            if (foundData == false) {
                {
                    return
                }
            }

            if (userData != null && thoughtData != null) {

                const reaction = {
                    reactionId: new ObjectID(),
                    reactionBody: req.body.reactionBody,
                    username: userData.username,
                    createdBy: userData._id,

                }

                thoughtData.reactions[thoughtData.reactions.length] = reaction;


                await thoughtData.save();

                res.json(thoughtData)
            }

            if (userData == null) {
                res.json({ message: 'User returned NULL' })
            }
            if (thoughtData == null) {
                res.json({ message: 'Thought returned NULL' })
            }

            if (thoughtData == null && userData == null) {
                res.json({ message: 'Both User and Thought returned NULL' })
            }


        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }

}


async function deleteReaction(req, res) {
    try {
        let foundData = true;
        const thoughtData = await Thought.findOne({ _id: req.params.thoughtId }).catch(
            function () {
                res.json({ message: "No thought found" })
                return foundData = false
            }
        )

        if (foundData == false) {
            {
                return
            }
        }


        if (thoughtData == null) {
            res.json({ message: `This thought _id returned NULL` })
            return
        }

        let hasReaction = false
        for (let i = 0; i < thoughtData.reactions.length; i++) {
            if (`${thoughtData.reactions[i].reactionId.toJSON()}` == `${req.params.reactionId}`) {
                hasReaction = true
            }
        }

        if (hasReaction == true) {
            reactionArr = thoughtData.reactions
            thoughtData.reactions = []

            for (let i = 0; i < reactionArr.length; i++) {
                if (`${reactionArr[i].reactionId.toJSON()}` != `${req.params.reactionId}`) {
                    thoughtData.reactions[thoughtData.reactions.length] = reactionArr[i]
                }

            }

            await thoughtData.save();

            res.json(thoughtData)

            return
        }

        if (hasReaction == false) {
            res.json({ message: `This reaction is not available to delete` })
            return
        }


    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}

module.exports = {
    getThoughts,
    getThought,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction
}