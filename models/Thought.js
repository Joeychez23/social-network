const { Schema, model } = require('mongoose');
const reactions = require('./reaction');

// Schema to create Post model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            //Format Date
        },
        username: {
            type: String,
            required: true,
        },
        createdBy:
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reactions: [reactions],
        

    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
            minimize: false
        },
        id: false,
    }
);

// Create a virtual property `reaction` that gets the amount of reaction per thought
thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length
})

// Initialize our thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;