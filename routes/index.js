var express = require('express');
var router = express.Router();

const Product = require('../models/Product');

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find({}, (error, result)=>{
      if(error){
        console.log(error);
       
      }
      var productGrid=[];
      var columnGrid=3;
      for(var i=0; i<result.length; i+=columnGrid){

        productGrid.push(result.slice(i, i+columnGrid));
      }
      
      res.render('index', { title: 'carte du shopping', products: productGrid });
    })
    
  
  
});

module.exports = router;
