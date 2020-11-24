const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login')

const User = require('../models/User')




router.post('/signup', (req, res, next) => {
  console.log(req.body)
  const {username, password} = req.body

  if(username === '' || password === '') {
    res.render('welcomePage', {invalidMessage: 'Please insert valid username and password'})
    return 
  }

  User.findOne({username})
  .then(user => {
    if(!user) {
      bcrypt.hash(password, 10)
      .then(hashedPass => {
        User.create({username, password: hashedPass})
        .then(() => {
          res.render('welcomePage', {succesMessage: 'Successfully registered. Now you can login'})
        })
      })
    } else {
      res.render('welcomePage', {alreadyMessage: 'This user already exist'})
    }
  })
  .catch(err => console.log(err))
});

router.post('/login', passport.authenticate("local", {
  successRedirect: '/user-homepage',
  failureRedirect: '/',
  failureFlash: true,
  passReqToCallback: true
}))

router.get("/user-homepage", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  res.render("userHomePage", { user: req.user });
});

router.get('/logout', ensureLogin.ensureLoggedIn("/"), (req, res) => {
  req.logout()
  res.redirect('/')
})


module.exports = router