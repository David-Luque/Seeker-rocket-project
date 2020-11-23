const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login')

const User = require('../models/User')
const Boardgame = require('../models/Boardgame')
const Prototipe = require('../models/Prototipe');
// const { routes } = require('../app');

//rute autentication


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

//ruta privada que solo puedas ver si has iniciado sesion, que tambien sirve para comprobar que hemos iniciado sesion. El MIDDLEWARE se pono como argumento entre el enlace y el callback function
// router.get('/private-page', ensureLogin.ensureLoggedIn('/log-in'), (req, res) => { // => detro de los parentesis de "ensureLogin.ensureLoggedIn()" se pone la direccion a la que quieres que te redirija si no estás logueado. CUIDADO porque por defecto pone 'login'
//   res.render('private', {user: req.user.username})
// })





router.get("/user-homepage", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  res.render("userHomePage", { user: req.user });
});




const checkForAuth = (req, res, next) =>{
  if(req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/')
  }
}

router.get('/logout', checkForAuth, (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/all-games', checkForAuth, (req, res) =>{
  Boardgame.find({})
  .then(games => {
    res.render('allGames', {games})
  })
})

router.get('/game-info/:id', checkForAuth, (req, res) => {
  const id = req.params.id
  Boardgame.findById(id)
  .then(game => {
    res.render('gameInfo', game)
  })
  .catch()
  
});

router.post('/add-game/:id', checkForAuth, (req, res) =>{
  
  const id = req.params.id
  const user = req.user
  
  Boardgame.findByIdAndUpdate(id, {$push: {users_favlist: user._id}}, {new: true})
  .then(game => {
    console.log(game)
    res.redirect(`/game-info/${game._id}`)
  })
})


router.get('/prototipes-collection', checkForAuth, (req, res) => {
  const user = req.user
  Prototipe.find({owner: user._id})
  .then(games => {
    res.render('protosCollection', {games})
  })
  .catch(err=>{res.send(err)}) 
  
});


router.get('/proto-info/:id', checkForAuth, (req, res) => {
  
  const id = req.params.id
  Prototipe.findById(id)
  .then(game => {
    //console.log(game)
    res.render('protoInfo', game)
  })
  .catch(err=>{res.send(err)}) 
})


router.get('/edit-proto/:id', checkForAuth, (req, res) => {
  const id = req.params.id
  Prototipe.findById(id)
  .then(game => {
    res.render('editPrototipe', game)
  })
  .catch(err=>{res.send(err)})
});


router.post('/edit-proto/:id', checkForAuth, (req, res) => {
  
  const id = req.params.id
  const editedProto = req.body
  const user = req.user
  
  Prototipe.findByIdAndUpdate(id, {...editedProto, owner: user._id})
  .then(game => {
    console.log(game)
    res.redirect(`/proto-info/${game._id}`)
  })
  .catch(err=>{res.send(err)})
});


router.get('/create-prototipe', checkForAuth, (req, res)=>{
  res.render('createPrototipe')
})

router.post('/create-prototipe', checkForAuth, (req, res)=>{
  const createdProto = req.body
  const user = req.user
  Prototipe.create({...createdProto, owner: user.id})
  .then(()=>{
    res.redirect('/prototipes-collection')
  })
  .catch(err=>res.send(err))
})



//_____________________________________________________________________________

// TO REVIEW

router.get('/games-collection', checkForAuth, (req, res) =>{

  Boardgame.find({users_favlist: {$in: [req.user._id]}})
  .then(games => {
    res.render('boardgamesCollection', {games})
  })
  .catch(err=>res.send(err))
})


router.get('/remove-boardgame/:id', checkForAuth, (req, res, next)=>{
  const user = req.user
  const id = req.params.id
  
  Boardgame.findById(id)
  .then((game) => {
    const userIndex = game.users_favlist.indexOf(user._id)
    const newFavList = game.users_favlist.splice(userIndex, 1)
    Boardgame.findByIdAndUpdate(id, {users_favlist: newFavList})
    .then(() => res.redirect('/games-collection'))
  })
  .catch(error => res.send(error))
})

router.get('/remove-prototipe/:id', checkForAuth, (req, res, next)=>{
  const id = req.params.id
  Prototipe.findByIdAndDelete(id)
  .then(() => res.redirect('/prototipes-collection'))
  .catch(error => res.send(error))
})

router.post('/comment-game/:id', checkForAuth, (req, res, next)=>{
  const id = req.params.id
  const comment = req.body
  Boardgame.findByIdAndUpdate(id, {$push: {comments: comment}}, {new: true})
  .then(() => res.redirect('/prototipes-collection'))
  .catch(error => res.send(error))
})

//_____________________________________________________________________________







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