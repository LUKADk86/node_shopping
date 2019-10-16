var express = require('express');
var router = express.Router();

const Product = require('../models/Product');

/* GET home page. */
router.get('/', function (req, res, next) {

  Product.find({}, (error, result) => {
    if (error) {
      console.log(error);

    }
    //un tableau contenant des tableau de 3 objets pour un affichage dynamique
    var productGrid = [];
    //constant permet de limiter 3 par ligne c a d le sous tab de 3 objet
    var columnGrid = 3;
    //boucle pour creer le tab productGrid
    for (var i = 0; i < result.length; i += columnGrid) {

      productGrid.push(result.slice(i, i + columnGrid));
    }

    res.render('index', { title: 'carte du shopping', products: productGrid, checkuser: req.isAuthenticated() });
  })



});

module.exports = router;
