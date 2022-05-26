var express = require('express');
const async = require('hbs/lib/async');
const { response } = require('../app');
var router = express.Router();

//requiring product helper file
var productHelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products})
  })
    
});


//path for add-prodcut
router.get('/add-product',function(req,res){
  res.render('admin/add-product',{admin:true})
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

//delete product setup not working
router.get('/delete-product/',(req,res)=>{
  let proId=req.query.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
  
})

//edit product
router.get('/edit-product/',async(req,res)=>{
  let prodcut=await productHelpers.getAllProducts(req.query.id)
  console.log(prodcut)
  res.render('admin/edit-product',{prodcut})
})

module.exports = router;
