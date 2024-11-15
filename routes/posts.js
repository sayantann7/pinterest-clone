const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageText: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: []
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Post', postSchema);