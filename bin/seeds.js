const mongoose = require('mongoose');

const Boardgame = require('../models/Boardgame');

 

mongoose
.connect(`mongodb+srv://david-la-91:${process.env.PASSWORD}@cluster0.mi8ae.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, { useNewUrlParser: true }, { useUnifiedTopology: true })
.then(x => {
  console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
})
.catch(err => {
  console.error('Error connecting to mongo', err)
});

const games = [
  {
    name: 'Gloomhaven',
    year_published: 2018,
    description: 'a very long game',
    rating: 94,
    comments:'',
    min_players: 1,
    max_players: 4,
    min_playtime: 30,
    max_playtime: 90,
    complexity: 3,
    rank: 1,
    mechanisms: ['hand-managment', 'card-drafting', 'grid-movement'],
    category: ['cooperative', 'thematic', 'strategy', 'card-game'],
    image: 'https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__imagepagezoom/img/tzd7s5trxMU7W01HxXd4PPSwEfM=/fit-in/1200x900/filters:no_upscale():strip_icc()/pic2437871.jpg',
    users_favlist: '',
  },{
    name: 'Watergate',
    year_published: 2019,
    description: 'confrantation game for two players',
    rating: 85,
    comments: {type: [String]},
    min_players: 2,
    max_players: 2,
    min_playtime: 30,
    max_playtime: 60,
    complexity: 3,
    rank: 40,
    mechanisms: ['hand-managment'],
    category: ['strategy', 'card-game', 'wargame'],
    image: 'https://cf.geekdo-images.com/iTBogxNFa3Ymh-6ST3srsw__imagepage/img/_ymKhPfiJCNwy64kv7uY9pYsNqU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4768766.jpg',
    users_favlist: '',
  }
]








  Boardgame.create(games)
  .then(result=>console.log(result))
  .catch(err=>console.log(err))