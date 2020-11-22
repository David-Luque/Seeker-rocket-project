const express = require('express');
const User = require('../models/User');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  
  if(user.id) {
    res.redirect('/user-homepage')
  } else {
    res.render('welcomePage', {layout: false});
  }
});

module.exports = router;
