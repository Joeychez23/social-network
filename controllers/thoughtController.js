const { User, Thought } = require('../models');
const { find } = require('../models/User');

async function getThoughts(req, res) {
    try {

        const data = await Thought.find({})
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }

}

async function getThought(req, res) {
    try {

        const data = await Thought.findOne({ _id: req.params.thoughtId })
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
        const userData = await User.findOne({ _id: data.createdBy });

        if (req.body.createdBy == null && userData != null) {
            data.thoughtText = req.body.thoughtText;
            console.log(data)
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


            if (`${userData._id.toJSON()}` == `${userData2._id.toJSON()}`) {
                sameUser = true
            }

            console.log(sameUser)
            if (sameUser == true) {
                //data.username = userData.username
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
        await Thought.deleteOne({ _id: req.params.thoughtId })
            .catch(
                function () {
                    res.json({ message: "No Thought found" })
                    return foundData = false
                }
            )

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

module.exports = {
    getThoughts,
    getThought,
    createThought,
    updateThought,
    deleteThought,
}