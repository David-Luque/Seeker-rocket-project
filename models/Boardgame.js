const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const boardgameSchema = new Schema({
  name: {type: String, required: true, unique: true},
  year_published: {type: Number},
  description: {type: String},
  rating: {type: Number, min: 10, max: 100},
  comments: {type: [String]},
  min_players: {type: Number, min: 1},
  max_players: {type: Number},
  min_playtime: {type: Number},
  max_playtime: {type: Number},
  complexity: {type: Number, min: 1, max: 5},
  rank: {type: Number},
  mechanisms: {type: [String], enum: ['auctioning', 'engine-building', 'drawing', 'set-collection', 'worker-placement', 'hand-managment', 'card-drafting', 'grid-movement']},
  category: {type: [String], enum: ['abstract', 'cooperative', 'thematic', 'strategy', 'card-game', 'deduction', 'party-game', 'dexterity', 'economic', 'wargame']},
  image: {type: String},
  users_favlist: {type: String}
  // users_favlist: {type: [Schema.Types.ObjectId]}
})

const Boardgame = mongoose.model('Boardgame', boardgameSchema)

module.exports = Boardgame