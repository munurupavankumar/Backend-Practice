const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chapter8');

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    age: Number,
    password: String
});

module.exports = mongoose.model('user', userSchema);