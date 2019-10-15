const mongoose = require('mongoose');
const productSchema= mongoose.Schema({
    imagepath:{
        type:String,
        required:true
    },
    productName:{
        type: String,
        required: true
    },
    information:{
        required:true,
        type:{
            pate: String,
            garniture: String,
            sauce: String
        }

    },
    price:{
        type: Number,
        required:true
    }
});
module.exports= mongoose.model('Product', productSchema)