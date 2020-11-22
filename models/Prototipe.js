const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const protoSchema = new Schema({
  name: {type: String, required: true, unique: true},
  description: {type: String},
  min_players: {type: Number, min: 1},
  max_players: {type: Number},
  min_playtime: {type: Number},
  max_playtime: {type: Number},
  complexity: {type: Number, min: 1, max: 5},
  mechanisms: {type: String, enum: ['auctioning', 'cooperative', 'engine-building', 'drawing', 'set-collection', 'worker-placement']},
  category: {type: String, enum: ['abstract', 'thematic', 'strategy', 'card-game', 'deduction', 'party-game', 'dexterity', 'economic', 'wargame']},
  image: {type: String},
  designer_notes: {type: String},
  owner: {type: Schema.Types.ObjectId}
})

const Prototipe = mongoose.model('Quote', protoSchema)

module.exports = Prototipe