const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login')

const User = require('../models/User')
const Boardgame = require('../models/Boardgame')
const Prototipe = require('../models/Prototipe')



const checkForAuth = (req, res, next) =>{
  if(req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/')
  }
}


//____________________________________________________________________________
//ROUTES TO SEARCH


//route to search by name
router.post('/search-by-name', checkForAuth, (req, res) => {
  const name = req.body.search
  
  const firstLetter = name.charAt(0)
  const firstUpperLetter = firstLetter.toUpperCase()
  const restWord = name.slice(1, name.length)
  const finalWord = firstUpperLetter.concat(restWord)
  

  Boardgame.findOne({name: finalWord})
  .then(game => {
    if(!game) {
      res.redirect('/not-results')
    } else {
      res.redirect(`/game-info/${game._id}`)
    }
  })
  .catch(err => console.log(err))
});

router.get('/not-results', checkForAuth, (req, res) => {
  res.render ('notResult')
})

//____________________________________________________________________________
//ROUTES TO SORT


//route to SORT alphabetically
router.get('/sort-name', checkForAuth, (req, res, next) => {
  
  Boardgame.find({}).sort( {name: 1} )
  .then(games => {
    res.render ('allGames', {games})
  })
  .catch(err => console.log(err))
});


router.get('/sort-rating', checkForAuth, (req, res, next) => {
  
  Boardgame.find({}).sort( {rating: -1} )
  .then(games => {
    res.render ('allGames', {games})
  })
  .catch(err => console.log(err))
});


router.get('/sort-rank', checkForAuth, (req, res, next) => {
  
  Boardgame.find({}).sort( {rank: 1} )
  .then(games => {
    res.render ('allGames', {games})
  })
  .catch(err => console.log(err))
});

router.get('/sort-complexity', checkForAuth, (req, res, next) => {
  
  Boardgame.find({}).sort( {complexity: -1} )
  .then(games => {
    res.render ('allGames', {games})
  })
  .catch(err => console.log(err))
});


router.get('/sort-recent-year', checkForAuth, (req, res, next) => {
  
  Boardgame.find({}).sort( {year_published: -1} )
  .then(games => {
    res.render ('allGames', {games})
  })
  .catch(err => console.log(err))
});

router.get('/filter-players/:players', checkForAuth, (req, res, next) => {
  console.log(req.query)


  Boardgame.find({}, {$and: [{$min_players: {$gte: X}}, {$max_players: {$lte: X}}]})
  .then(games => {
    res.render ('allGames', {games})
  })
  .catch(err => console.log(err))
});



router.get('/advanced-search', checkForAuth, (req, res, next) => {
  res.render('advancedSearch')
})





module.exports = router;






























module.exports = router;