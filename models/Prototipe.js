
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const protoSchema = new Schema({
  name: {type: String, required: true, unique: true},
  description: {type: String},
  tags: {type: [String]},
  min_players: {type: Number, min: 1},
  max_players: {type: Number},
  min_playtime: {type: Number},
  max_playtime: {type: Number},
  mechanisms: {type: String},
  category: {type: String},
  image: {type: String},
  designer_notes: {type: String},
  owner: {type: Schema.Types.ObjectId}
})

const Prototipe = mongoose.model('Prototipe', protoSchema)

module.exports = Prototipe