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


router.get('/advanced-search', checkForAuth, (req, res, next) => {
  res.render('advancedSearch')
})


//_____________________________________________________________________
//TO REVIEW

// router.get('/filter-players/:players', checkForAuth, (req, res, next) => {
//   console.log(req.query)
// });



router.get('/search-players', checkForAuth, (req, res, next) => {
  
  const min = req.query.min_players
  const max = req.query.max_players
  
  Boardgame.find({$and: [{min_players: min}, {max_players: max}]})
  .then(games => {
    if(games.length === 0) {
      res.redirect('/not-results')
    } else {
      res.render ('allGames', {games})
    }  
  })
  .catch(err => console.log(err))
})


router.get('/search-playtime', checkForAuth, (req, res, next) => {
  
  const min = req.query.min_playtime
  const max = req.query.max_playtime
  
  Boardgame.find({$and: [{min_playtime: {$gte: min}}, {max_playtime: {$lte: max}}]})
  .then(games => {
    if(games.length === 0) {
      res.redirect('/not-results')
    } else {
      res.render ('allGames', {games})
    }  
  })
  .catch(err => console.log(err))
})


router.get('/search-parameters', checkForAuth, (req, res, next) => {
 
  const {criteria, preference, value} = req.query

  switch (criteria) {
    case "year_published":
      if(preference === "greater") {
        Boardgame.find({year_published: {$gte: value}})
        .then(games => {
          if(games.length === 0) {
            res.redirect('/not-results')
          } else {
            res.render ('allGames', {games})
          }  
        })
        .catch(err => console.log(err))
        return
      }
      if(preference === "lower") {
        Boardgame.find({year_published: {$lte: value}})
        .then(games => {
          if(games.length === 0) {
            res.redirect('/not-results')
          } else {
            res.render ('allGames', {games})
          }  
        })
        .catch(err => console.log(err))
        return
      }
      if(preference === "equal") {
        Boardgame.find({year_published: {$eq: value}})
        .then(games => {
          if(games.length === 0) {
            res.redirect('/not-results')
          } else {
            res.render ('allGames', {games})
          }  
        })
        .catch(err => console.log(err))
        return
      }
      break;

    case "complexity":
      if(preference === "greater") {
        Boardgame.find({complexity: {$gte: value}})
        .then(games => {
          if(games.length === 0) {
            res.redirect('/not-results')
          } else {
            res.render ('allGames', {games})
          }  
        })
        .catch(err => console.log(err))
        return
      }
      if(preference === "lower") {
        Boardgame.find({complexity: {$lte: value}})
        .then(games => {
          if(games.length === 0) {
            res.redirect('/not-results')
          } else {
            res.render ('allGames', {games})
          }  
        })
        .catch(err => console.log(err))
        return
      }
      if(preference === "equal") {
        Boardgame.find({complexity: {$eq: value}})
        .then(games => {
          if(games.length === 0) {
            res.redirect('/not-results')
          } else {
            res.render ('allGames', {games})
          }  
        })
        .catch(err => console.log(err))
        return
      }
      break;

    case "rating":
      if(preference === "greater") {
        Boardgame.find({rating: {$gte: value}})
        .then(games => {
          if(games.length === 0) {
            res.redirect('/not-results')
          } else {
            res.render ('allGames', {games})
          }  
        })
        .catch(err => console.log(err))
        return
      }
      if(preference === "lower") {
        Boardgame.find({rating: {$lte: value}})
        .then(games => {
          if(games.length === 0) {
            res.redirect('/not-results')
          } else {
            res.render ('allGames', {games})
          }  
        })
        .catch(err => console.log(err))
        return
      }
      if(preference === "equal") {
        Boardgame.find({rating: {$eq: value}})
        .then(games => {
          if(games.length === 0) {
            res.redirect('/not-results')
          } else {
            res.render ('allGames', {games})
          }  
        })
        .catch(err => console.log(err))
        return
      }
      break;
  
  }
})


// const min = req.query.min_playtime
// const max = req.query.max_playtime

// Boardgame.find({$and: [{min_playtime: {$gte: min}}, {max_playtime: {$lte: max}}]})
// .then(games => {
//   if(games.length === 0) {
//     res.redirect('/not-results')
//   } else {
//     res.render ('allGames', {games})
//   }  
// })
// .catch(err => console.log(err))


router.get('/search-parameters', checkForAuth, (req, res, next) => {
  
})

//_____________________________________________________________________


module.exports = router;





//find({$and: [{min_players: {$gte: min}}, {max_players: {$lte: max}}]})


















