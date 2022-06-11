const { response } = require('express');
var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
//requiring product helper file
const productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')



/* GET home page. */
router.get('/', async function (req, res, next) {
  //setting express session
  let user = req.session.user
  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { admin: false, products, user, cartCount })
  })
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})



router.get('/signup', (req, res) => {
  res.render('user/signup')
})

//setting signup
router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn = true
    req.res.user = response
    res.redirect('/')
  })
})

//login set up
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      //setting express session
      req.session.loggedIn = true
      req.session.user = response.user

      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid user name or password"
      res.redirect('/login')
    }
  })
})

//logout settings
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

//cart setup
router.get('/cart', async (req, res) => {
  if (req.session.loggedIn) {
    let products = await userHelpers.getCartProducts(req.session.user._id)
    let cartTotal = await userHelpers.getTotalAmount(req.session.user._id)
    //console.log(cartTotal)
    res.render('user/cart', { products, user: req.session.user,cartTotal})
  } else {
    res.redirect('/login')
  }
})

//cart setup
router.get('/add-to-cart/:id', (req, res) => {
  //if(req.session.loggedIn){
  console.log('api call')
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    //res.redirect('/')
  })
  //}else{
  //res.redirect('/login')
  //}
})


//change product
router.post('/change-product-quanity', (req, res, next) => {
  userHelpers.changeProductQuantity(req.body).then((response) => {
    res.json(response)
  })
})

//delete-cart
router.get('/cart/delete-cart/', (req, res) => {
  let proId = req.query.id
  console.log(proId);
  userHelpers.deleteCart(proId).then((response) => {
    res.redirect('/cart/')
  })

})

//order setup
router.get('/order', async (req, res) => {
  if (req.session.loggedIn) {
    let total = await userHelpers.getTotalAmount(req.session.user._id)
    res.render('user/order',{total})
  } else {
    res.redirect('/login')
  }
})


module.exports = router;
