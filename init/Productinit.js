const Product=require('../models/Product');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pizzaShopping',{useNewUrlParser:true, useUnifiedTopology: true},(error)=>{
  if(error){
    console.log(error)
  }else{
  console.log('connexion réussie à la db pizzeria');
}
});


products= [new Product({
    imagepath: '/images/pizza1.jpg',
    productName: 'pizza au poulet',
    information:{
            pate: 'aux fromages',
            garniture: 'au poulet',
            sauce: 'authentique'
        },
    price: 6
}),
new Product({
    imagepath: '/images/pizza2.jpg',
    productName: 'pizza margarita',
    information:{
            pate: 'aux fromages',
            garniture: '4 fromages',
            sauce: 'classique'
        },
    price: 4
}),
new Product({
    imagepath: '/images/pizza3.jpg',
    productName: 'pizza maritime',
    information:{
            pate: 'aux fromages',
            garniture: 'au fruits de mer',
            sauce: 'mediterraneene'
        },
    price: 7
}),
new Product({
    imagepath: '/images/pizza4.jpg',
    productName: 'pizza alsacienne',
    information:{
            pate: 'aux fromages',
            garniture: 'au chiddar',
            sauce: 'nordique'
        },
    price: 4
}),
new Product({
    imagepath: '/images/pizza5.jpg',
    productName: 'pizza cevenole',
    information:{
            pate: 'aux fromages',
            garniture: 'aux plantes',
            sauce: 'végétarienne'
        },
    price: 6
}),
new Product({
    imagepath: '/images/pizza6.jpg',
    productName: 'pizza au potatoes',
    information:{
            pate: 'aux fromages',
            garniture: 'au potaotes',
            sauce: 'lourde'
        },
    price: 6
})
]
var done=0;
for(i=0; i<products.length; i++){
    products[i].save((error, doc)=>{
        if(error){
            console.log(error)
        }
        console.log(doc);
        done++;
        if(done===products.length){
            mongoose.disconnect();
        }
    })
}
