var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const expressHbs = require('express-handlebars') ;
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

mongoose.connect('mongodb://localhost/pizzaShopping',{useNewUrlParser:true, useUnifiedTopology: true},(error)=>{
  if(error){
    console.log(error)
  }
  console.log('connexion réussie à la db pizzeria')
});

//importer le ficher passport pour qu'il fonctionne avec local strategy (signin) sur tous les fichiers
require('./config/passport');
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout:'layout', extname: '.hbs'}))

app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(session({
  secret:'pizzeria-shopping', 
  saveUninitialized: false, 
  resave: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));





app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
