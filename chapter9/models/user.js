const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.01:27017/chapter9");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    age: Number,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
})

module.exports = mongoose.model('user',userSchema);