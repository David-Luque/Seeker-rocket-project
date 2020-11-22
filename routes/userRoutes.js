const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login')

const User = require('../models/User')
const Boardgame = require('../models/Boardgame')
const Prototipe = require('../models/Prototipe')

//rute autentication

// router.get('/sign-up', (req, res, next) => {
//   res.render('signUp');
// });

router.post('/sign-up', (req, res, next) => {
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


// router.get('/log-in', (req, res, next) => {
//   res.render('welcomePage', {errMessage: req.flash('error')})
// })

router.post('/log-in', passport.authenticate("local", {
  successRedirect: '/Userpage',
  failureRedirect: '/',
  failureFlash: true,
  passReqToCallback: true
}))

//ruta privada que solo puedas ver si has iniciado sesion, que tambien sirve para comprobar que hemos iniciado sesion. El MIDDLEWARE se pono como argumento entre el enlace y el callback function
// router.get('/private-page', ensureLogin.ensureLoggedIn('/log-in'), (req, res) => { // => detro de los parentesis de "ensureLogin.ensureLoggedIn()" se pone la direccion a la que quieres que te redirija si no estás logueado. CUIDADO porque por defecto pone 'login'
//   res.render('private', {user: req.user.username})
// })


router.post('/log-out', (req, res) => {
  req.logout()
  res.redirect('/')
})


const checkForAuth = (req, res, next) =>{
  if(req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/')
  }
}

router.get('/user-homepage', checkForAuth, (req, res) => {
  res.render('userHomePage')
});

router.get('/games-collection', checkForAuth, (req, res) => {
  res.render('userGamesCollection')
});

router.get('/prototipes-collection', checkForAuth, (req, res) => {
  Prototipe.find({owner: user._id})
  .then(data=>{
    res.render('userPrototipesCollection', {protos: data})
  })
  .catch(err=>{res.send(err)}) 
  
});

router.get('/game-info/:id', checkForAuth, (req, res) => {
  res.render('gameInfo')
});

router.get('/createPrototipe', checkForAuth, (req, res) => {
  res.render('createPrototipe')
});

router.get('/edit-game/:id', checkForAuth, (req, res) => {
  res.render('editGame')
});

router.post('/editPrototipe', checkForAuth, (req, res) => {
  const id = req.params.id
  Prototipe.updateOne(id)

  res.render('editPrototipe')
});

router.get('/create-prototipe', checkForAuth, (req, res)=>{
  res.render('createPrototipe')
})

router.post('/create-prototipe', checkForAuth, (req, res)=>{
  const {artist, songName, quoteContent} = req.body
  const id = req.user._id

  Prototipe.create({artist, songName, quoteContent, owner: id})
  .then(()=>{
    res.redirect('/prototipes-collection') //=> ¿ññevar o renderizar a pagina del juego creado?
  })
  .catch(err=>res.send(err))
})


//ESTA FORMA DE ASEGURAR AL PROPIETARIO DEL QUOTE ES OBLIGATORIA EN RUTAS DE EDITAR Y ELIMINAR; OPCIONAL SI DEJAR VER O NO A LOS DEMAS LOS DETALLES
//SE PODRIA SACAR COMO MIDDLEWARE, SIMILAR A "checkForAuth", y ponerla fuera para luego llamarla, como los ROLES
router.get('/editPrototipe/:id', checkForAuth, (req, res) => {
  const id = req.params.id 
  Prototipes.findOne({_id: id})
  .then(data=>{
  // A continuacion comparamos el id del quote buscado antes con el del usuario activo (ambos pasados a strings porque son objetos (type: Schema.Types.ObjectId) de manera que si coinciden, porque es el mismo usuario que lo creó, podemos acceder a la view de editar el quote; si no, redirect al home u otro sitio)
    if(data.owner.toString() == req.user._id.toString()) { 
      res.render('editPrototipe')
    } else {
      res.redirect('/user-homepage')
    }
  })
  .catch(err=>{res.send(err)}) 
})



module.exports = router;