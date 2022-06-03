var db = require('../config/connection')
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { reject } = require('bcrypt/promises');
const { response } = require('../app');
const async = require('hbs/lib/async');
const { use } = require('express/lib/router');
var objectId = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            //  userData.password=  salt=   await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data)
                // console.log(userData.password)
                // console.log(userData.email)                    
            });
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                // check if password matches    
                bcrypt.compare(userData.password, user.password).then((status) => {
                    //console.log(user.password)
                    //console.log(userData.password)

                    if (status) {
                        console.log("login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                        // response.user=user
                        // response.status=true
                        // resolve(response)

                    } else {

                        console.log('login failed');
                        resolve({ status: false })
                        // resolve({status:false})

                    }
                })
            } else {
                console.log("Email not found")
                resolve({ status: false })
                //     resolve({status: false})
            }
        })

    },
    addToCart: (proId, userId) => {
        let proObj = {
            item: objectId(proId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            console.log(userCart)
            if (userCart) {
                let proExists = userCart.products.findIndex(product => product.item == proId)
                console.log(proExists)
                if (proExists != -1) {
                    db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId),'products.item': objectId(proId) },
                        {
                            $inc: { 'products.$.quantity': 1 }
                        }
                    ).then(()=>{
                        resolve()
                    })
                } else {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) },
                        {
                            $push: { products: proObj }
                            //$push: { products: objectId(proId) }
                        }
                    ).then((response) => {
                        resolve()
                    })
                }
            } else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                    //products:[objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }
                // {
                //     $lookup: {
                //         from: collection.PRODUCT_COLLECTION,
                //         let: { proList: '$products' },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: {
                //                         $in: ['$_id', '$$proList']
                //                     }
                //                 }
                //             }
                //         ],
                //         as: 'cartItems'
                //     }
                // }
            ]).toArray()
            //console.log(cartItems[0].product)
            resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },
    //increment or decerement project
    changeProductQuantity:(details)=>{
        details.count=parseInt(details.count)
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION).updateOne({_id:objectId(details.cart), 'products.item': objectId(details.product) },
                        {
                            $inc: { 'products.$.quantity': details.count }
                        }
                    ).then(()=>{
                        resolve()
                    })
        })
    }
}