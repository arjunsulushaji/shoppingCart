var express = require('express');
var router = express.Router();
//requiring product helper file
var productHelpers=require('../helpers/product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {

  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products})
  })
});

module.exports = router;
