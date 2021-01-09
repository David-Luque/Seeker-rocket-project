const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login')

const User = require('../models/User')
const Boardgame = require('../models/Boardgame')


router.post('/signup', (req, res, next) => {
  const {username, password} = req.body

  if(username === null || password === null) {
    res.render('welcomePage', {layout: false, invalidMessage: 'Insert valid username and password'})
    return 
  }

  User.findOne({username})
  .then(user => {
    if(!user) {
      bcrypt.hash(password, 10)
      .then(hashedPass => {
        User.create({username, password: hashedPass})
        .then(() => {
          res.render('welcomePage', {layout: false, succesMessage: 'Successfully registered'})
        })
      })
    } else {
      res.render('welcomePage', {layout: false, alreadyMessage: 'This user already exist'})
    }
  })
  .catch(err => console.log(err))
});

router.post('/login', passport.authenticate("local", {
  successRedirect: '/user-homepage',
  failureRedirect: '/error-login',
  failureFlash: true,
  passReqToCallback: true
}))

router.get("/user-homepage", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  Boardgame.find({})
  .then(games => {
    res.render("userHomePage", {games});
  })
  .catch( err => console.log (err))
  
});

router.get('/logout', ensureLogin.ensureLoggedIn("/"), (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router