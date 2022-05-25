const { response } = require('express');
var express = require('express');
var router = express.Router();
//requiring product helper file
const productHelpers=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-helpers')



/* GET home page. */
router.get('/', function(req, res, next) {
  //setting express session
  let user=req.session.user
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products,user})
  })
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
  }
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

//login set up
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      //setting express session
      req.session.loggedIn=true
      req.session.user=response.user

      res.redirect('/')
    }else{
      req.session.loginErr="Invalid user name or password"
      res.redirect('/login')
    }
  })
})

//logout settings
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

//cart setup
router.get('/cart',(req,res)=>{
  if(req.session.loggedIn){
    res.render('user/cart')
  }else{
    res.redirect('/login')
  }
})


module.exports = router;
