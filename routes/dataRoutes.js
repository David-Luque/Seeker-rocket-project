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
router.get('/search', (req, res, next) => {
  
  Model.findOne()
});



//____________________________________________________________________________
//ROUTES TO SORT


//route to SORT by published year
router.get('/search', (req, res, next) => {
  req.query

  Model.findOne()
});




module.exports = router;






























module.exports = router;