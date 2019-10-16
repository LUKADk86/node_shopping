var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('passport');

/* GET users listing. */
router.get('/signup', function (req, res, next) {
  var messageError = req.flash('error');
  res.render('user/signup', { message: messageError });
});
router.post('/signup', [
  check('email').not().isEmpty().withMessage('veuillez entrer un email'),
  check('email').isEmail().withMessage('email non correcte'),
  check('password').not().isEmpty().withMessage('veuillez entrer un mot de passe'),
  check('password').isLength({ min: 5 }).withMessage('le mdp doit contenir au moin 5 caractères'),
  check('confirm-password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('mots de passe non identiques');

    }
    return true;
  })
], 
function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    var errorsTab = [];
    for (var i = 0; i < errors.errors.length; i++) {
      errorsTab.push(errors.errors[i].msg);
    }
    req.flash('error', errorsTab);
    res.redirect('signup')
    return;
  }
  const user = new User({
    email: req.body.email,
    password: new User().hashPassword(req.body.password)
  });
  User.findOne({ email: req.body.email }, (error, result) => {
    if (error) {
      console.log(error)
    }
    if (result) {
      req.flash('error', 'email déjà utilisé')
      res.redirect('signup')
      return;
    }
    user.save((error, result) => {
      if (error) {
        console.log(error)
      }
      res.send(result);
    })
  })
});
router.get('/signin', (req, res, next)=>{
  //passer les erreurs d'authentification difinies dans passport local-signin
  errormsg=req.flash('signinError')
  res.render('user/signin', {message: errormsg}) 
});
router.get('/profile', (req, res, next)=>{
  res.render('user/profile') 
});
router.post('/signin', [
  //verifier avec express validator les checks
  check('email').not().isEmpty().withMessage('veuillez entrer un email'),
  check('email').isEmail().withMessage('email non correcte'),
  check('password').not().isEmpty().withMessage('veuillez entrer un mot de passe'),
  check('password').isLength({ min: 5 }).withMessage('le mdp doit contenir au moin 5 caractères')
 


], (req, res, next)=>{
  //function erreur et res comme la page signup

  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    var errorsTab = [];
    for (var i = 0; i < errors.errors.length; i++) {
      errorsTab.push(errors.errors[i].msg);
    }
    req.flash('signinError', errorsTab);
    res.redirect('signin')
    return;
  
    }
    }





,passport.authenticate(/*mettre le meme que celui de passportstrategy*/'local-signin', {
  //2eme parametre objet en cas de succes et le message et le redi en cas d echec selon le fichier passport
  successRedirect : 'profile',
  failureRedirect: 'signin',
  failureFlash : true,
}) )
module.exports = router;
