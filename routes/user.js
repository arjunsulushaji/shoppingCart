const { response } = require('express');
var express = require('express');
var router = express.Router();
//requiring product helper file
const productHelpers=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-helpers')
/* GET home page. */
router.get('/', function(req, res, next) {

  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products})
  })
});

router.get('/login',(req,res)=>{
  res.render('user/login')
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

//setting signup
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
     console.log(response);
  })
})

module.exports = router;
