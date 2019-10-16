const passport = require('passport');
const localStrategy = require('passport-local').Strategy ;
const User = require('../models/User');


passport.serializeUser((user, done)=>{
    return done(null, user.id)
})
passport.deserializeUser((id, done)=>{
    User.findById(id, ('email'),(err, user)=>{
        return done(err, user)
    })
   
})
//definir strategy de passport pour signin authentification
passport.use('local-signin', new localStrategy({
    //le premier est mail
    usernameField: 'email', 
    //deuxieme password
    passwordField: 'password',
    //ce 3eme dire qu'une fonction callback existe apres
    passReqToCallback: true
}, (req, email, password, done)=>{
    //requete recuperer l user avec son mail
    User.findOne({
        email: email
    }, (error, user)=>{
        //s'il y a erreur
            if(error){
                return done(error, false);
                
            }
            //s'il ne trouve pas l user
            if(! user){
                //done prend error en parametre, user en deuxieme, callbal req.flash en 3e
                return done(null, false, req.flash('signinError','verifiez votre mail'))
            }
            //s'il trouve un user et comparer les mdp
            if(! user.comparePassword(password)){
                return done(null, false, req.flash('signinError','erreur de mot de passe'))
            }
            //aucune erreur et user saisi exite en db
            return done(null, user)
        })
}))
passport.use('local-signup', new localStrategy({
    usernameField: 'email', 
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done)=>{
    User.findOne({email: email}, (error, user)=>{
        if(error){
            return done(error)
        }
        if(user){
            return done(null, user, req.flash('signupError', 'un compte existe déjà avec ce mail'))
        }
        const user1 = new User({
            email: email,
            password: new User.hashPassword(password)
        })
        user1.save((err, user)=>{
            if(err){
                return done(err)
            }
            return done(null, user)
        })
    })
}))