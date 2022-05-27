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

//delete product setup 
router.get('/delete-product/',(req,res)=>{
  let proId=req.query.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
  
})

//edit product
router.get('/edit-product/',async(req,res)=>{
  let product=await productHelpers.getProdctDetails(req.query.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})
//edit product balance
router.post("/edit-product/",(req,res)=>{
  let id=req.query.id
  productHelpers.updateProduct(req.query.id,req.body).then(()=>{
    res.redirect('/admin/')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})

module.exports = router;
