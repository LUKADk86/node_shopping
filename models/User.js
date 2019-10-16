const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//creation d'un table
const userSchema= mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
//permet de hasher le mort de passe lors de l inscription
userSchema.methods.hashPassword = function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}
//comparer le mort de passe saisi avec celui de db lors de la connexion
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports= mongoose.model('User', userSchema);