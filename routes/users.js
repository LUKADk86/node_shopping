var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../models/User');

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('user/signup');
});
router.post('/signup', [
  check('email').not().isEmpty().withMessage('veuillez entrer un email'),
  check('email').isEmail().withMessage('email non correcte'),
  check('password').not().isEmpty().withMessage('veuillez entrer un mot de passe'),
  check('password').isLength({min:5}).withMessage('le mdp doit contenir au moin 5 caractères'),
  check('confirm-password').custom((value, {req})=>{
    if(value !==req.body.password){
      throw new Error('mots de passe non identiques');
      
    }
    return true ;
  })
],function(req, res, next) {
  const errors= validationResult(req);
  if(! errors.isEmpty()){
    console.log(errors)
    return ;
  }
  const user = new User({
    email: req.body.email,
    password: new User().hashPassword(req.body.password)
  });
  user.save((error, result)=>{
    if(error){
      console.log(error)
    }
    res.send(result);
  })
  
});
module.exports = router;
