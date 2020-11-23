
const mongoose = require('mongoose');
const Schema = mongoose.Schema

userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  prototipe_games: [{type: Schema.ObjectId, ref: 'Prototipes'}]
})

const User = mongoose.model('User', userSchema)

module.exports = User