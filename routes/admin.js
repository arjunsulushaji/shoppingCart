var express = require('express');
var router = express.Router();

//requiring product helper file
var productHelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"Iphone 11",
      category:"mobile",
      description:"latest mobile",
      image:"data:image/jpeg;base64,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"
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
  res.render('admin/view-products',{admin:true,products})
});

//path for add-prodcut
router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image)

  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-product")
      }else{
        console.log(err)
      }
    })
  })
})
module.exports = router;
