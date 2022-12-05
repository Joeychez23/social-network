const { Schema, model } = require('mongoose');



const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Your email was Wrong,please enter a valid email address",]
    },
    thoughts: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: "Thought"
            },
        },
    ],
    friends: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
        },
    ]

}, {
    toJSON: {
        virtuals: true,
        getters: true,
        minimize: false
    },
    id: false,
})

userSchema.virtual("friendCount").get(function() {
    return this.friends.length
})

const User = model("User", userSchema)
module.exports = User;