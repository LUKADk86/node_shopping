var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('passport');

/* GET users listing. */
router.get('/signup',isNotSignin, function (req, res, next) {
  var messageError = req.flash('signupError');
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
    req.flash('signupError', errorsTab);
    res.redirect('signup')
    return;
  }
 next();
 
}, passport.authenticate('local-signup',{
  //2eme parametre objet en cas de succes et le message et le redi en cas d echec selon le fichier passport
  session: false,
  successRedirect : 'signin',
  failureRedirect: 'signup',
  failureFlash : true,
}))
router.get('/signin',isNotSignin, (req, res, next)=>{
  //passer les erreurs d'authentification difinies dans passport local-signin
  errormsg=req.flash('signinError')
  res.render('user/signin', {message: errormsg}) 
});
router.get('/profile',isSignin, (req, res, next)=>{
  //checkuser en true pour changer l'affiche de menu header
  res.render('user/profile', {checkuser: true, checkprofile: true}) 
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
  //il rentre dans la condition seulement en cas d'erreur(non vide), et il affiche l erreur sinon il fera next
  if (!errors.isEmpty()) {

    var errorsTab = [];
    for (var i = 0; i < errors.errors.length; i++) {
      errorsTab.push(errors.errors[i].msg);
    }
    req.flash('signinError', errorsTab);
    res.redirect('signin')
    return;
  
    }
    //le next permet de passer a la 2eme fucntion callbacl passport.authenticate sinon le processus s'arrête
    next();
    }
,passport.authenticate(/*mettre le meme que celui de passportstrategy*/'local-signin', {
  //2eme parametre objet en cas de succes et le message et le redi en cas d echec selon le fichier passport
  successRedirect : 'profile',
  failureRedirect: 'signin',
  failureFlash : true,
}))
//route qui permet de deconnecter (effacer) la session
router.get('/logout', isSignin,(req,res,next)=>{
  req.logOut();
  res.redirect('/')
 
} )
//permet d'empêcher l'acces sans authentification a /profile, on l'utilise a get profile et get logout
function isSignin(req, res, next){
  if(req.isUnauthenticated()){
    res.redirect('/users/signin')
    return;
  }
  next();
}
//permet de redireger si l'user tente d accecer a la page connexion ou entregistrement, une fois authentifié, utilisé a get signin et get signup
function isNotSignin(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/')
    return;
  }
  next();
}
module.exports = router;
