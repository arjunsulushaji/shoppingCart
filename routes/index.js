var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"Iphone 11",
      category:"mobile",
      description:"latest mobile",
      image:""
    },
    {
      name:"Iphone 11",
      category:"mobile",
      description:"latest mobile",
      image:""
    },
    {
      name:"Iphone 11",
      category:"mobile",
      description:"latest mobile",
      image:""
    },
    {
      name:"Iphone 11",
      category:"mobile",
      description:"latest mobile",
      image:""
    }
  ]
  res.render('index', {products,admin:false});
});

module.exports = router;
