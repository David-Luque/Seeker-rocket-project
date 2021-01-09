require('dotenv').config();

const bodyParser      = require('body-parser');
const cookieParser    = require('cookie-parser');
const express         = require('express');
const favicon         = require('serve-favicon');
const hbs             = require('hbs');
const mongoose        = require('mongoose');
const logger          = require('morgan');
const path            = require('path');
const passport        = require('passport');
const LocalStrategy   = require('passport-local').Strategy
const session         = require('express-session')  
const bcrypt          = require('bcrypt')
const flash           = require('connect-flash')
const index           = require('./routes/index');
const userRoutes      = require('./routes/userRoutes');
const dataRoutes      = require('./routes/dataRoutes');
const authRoutes      = require('./routes/authRoutes');
const User            = require('./models/User');


mongoose
.connect(`mongodb+srv://david-la-91:${process.env.PASSWORD}@cluster0.mi8ae.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
.then(x => {
  console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
})
.catch(err => {
  console.error('Error connecting to mongo', err)
});

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('serve-static')(__dirname + '/../../public'));


//MIDDLEWARE SESSION
app.use(session({
  secret: 'somethingSecret',
  saveUninitialized: true,
  resave: true,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//MIDDLEWARE FLASH
app.use(flash())


//MIDDLEWARE FOR STRATEGY
passport.use(new LocalStrategy({passReqToCallback: true}, (req, username, password, next)=>{
  User.findOne({username})
  .then(user=>{
    if(!user) {
      return next(null, false, {message: 'Incorrect username'})
    }
    if(!bcrypt.compareSync(password, user.password)) {
      return next(null, false, {message: 'Incorrect password'})
    }
    return next(null, user)
  })
  .catch(err => next(err))
}))


app.use(passport.initialize())
app.use(passport.session())


// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use('/', index);
app.use('/', userRoutes);
app.use('/', dataRoutes);
app.use('/', authRoutes);


module.exports = app;
