const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true, // Comment text is mandatory
        trim: true
    },
    author: {
        type: String,
        required: true, // Author name is mandatory
        trim: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to the related post
        required: true
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment' // Self-referencing for nested comments
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the `updatedAt` field on updates
commentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;