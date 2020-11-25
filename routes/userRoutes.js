const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login')

const Boardgame = require('../models/Boardgame')
const Prototipe = require('../models/Prototipe');



const checkForAuth = (req, res, next) =>{
  if(req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/')
  }
}



router.get('/all-games', checkForAuth, (req, res) =>{
  Boardgame.find({})
  .then(games => {
    res.render('allGames', {games})
  })
})



router.get('/games-collection', checkForAuth, (req, res) =>{

  Boardgame.find({users_favlist: {$in: [req.user._id]}})
  .then(games => {
    res.render('boardgamesCollection', {games})
  })
  .catch(err=>res.send(err))
})

router.get('/prototipes-collection', checkForAuth, (req, res) => {
  const user = req.user
  Prototipe.find({owner: user._id})
  .then(games => {
    res.render('protosCollection', {games})
  })
  .catch(err=>{res.send(err)}) 
  
});



router.get('/game-info/:id', checkForAuth, (req, res) => {
  const id = req.params.id
  Boardgame.findById(id)
  .then(game => {
    res.render('gameInfo', game)
  })
  .catch()
  
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



router.post('/add-game/:id', checkForAuth, (req, res) =>{
  
  const id = req.params.id
  const user = req.user
  
  Boardgame.findById(id)
  .then(game => {
      if (game.users_favlist.includes(user._id)) {
        game.alertMessage = "This game is already in your collection";
        res.render('gameInfo', game)
      } else {
        Boardgame.findByIdAndUpdate(id, {$push: {users_favlist: user._id}}, {new: true})
        .then(game => {
          game.alertMessage = "Successfully added to your collection";
          res.render('gameInfo', game)
        })
      } 
  })
})

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



router.post('/comment-game/:id', checkForAuth, (req, res, next)=>{
  
  console.log(req.params.id)
  const newComment = req.body.comments
  const id = req.params.id
  
  if(newComment == "") {
    Boardgame.findById(id)
    .then(game => {
      game.commentMessage = "Please, insert valid comment";
      res.render('gameInfo', game)
    })
  } else {
    Boardgame.findByIdAndUpdate(id, {$push: {comments: newComment}}, {new: true})
    .then((game) => {
      res.redirect(`/game-info/${game._id}`)
    })
    .catch(error => console.log('nope'))
  }
})

router.post('/add-note/:id', checkForAuth, (req, res, next)=> {
  const id = req.params.id
  const noteToAdd = `. ${req.body.designer_notes}`
  Prototipe.findById(id)
  .then(game => {
    const oldNotes = game.designer_notes;
    const newNotes = oldNotes.concat(noteToAdd)
    console.log(newNotes)
    Prototipe.findByIdAndUpdate(id, {designer_notes: newNotes}, {new: true})
    .then(result => {
      console.log(result) 
      res.redirect (`/proto-info/${game._id}`)
    })
    
  })
  .catch(err => console.log(err))
})

router.get('/edit-proto/:id', checkForAuth, (req, res) => {
  const id = req.params.id
  Prototipe.findById(id)
  .then(game => {
    console.log(game)
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



router.get('/remove-game/:id', checkForAuth, (req, res, next)=>{
  const user = req.user
  const id = req.params.id
  
  Boardgame.findById(id)
  .then((game) => {
    if(game.users_favlist.includes(user._id)) {
      const userIndex = game.users_favlist.indexOf(user._id)
      const originalList = game.users_favlist
      
      originalList.splice(userIndex, 1)
      
      Boardgame.findByIdAndUpdate(id, {users_favlist: originalList}, {new:true})
      .then(() => {
        res.redirect('/games-collection')
      })
    } else {
      Boardgame.findById(id)
      .then(game => {
      game.deleteMessage = "This game isn't in your collection ";
      res.render('gameInfo', game)
    })
    }

  })
  .catch(error => res.send(error))
})

router.get('/remove-prototipe/:id', checkForAuth, (req, res, next)=>{
  const id = req.params.id
  Prototipe.findByIdAndDelete(id)
  .then(() => res.redirect('/prototipes-collection'))
  .catch(error => res.send(error))
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