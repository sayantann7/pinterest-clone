const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterest", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    dp: {
        type: String, // URL for the profile picture
        default: ''
    },
    posts: []
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);