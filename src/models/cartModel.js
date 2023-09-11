const productModel = require("../models/productModel")
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
    userId : {type:ObjectId, required:true,ref:'User'},
    items: [{productId:{type:ObjectId, required:true,ref:'Product'}, quantity: {type:Number,required:true}}],
    totalPrice: {type:Number,required:true}, //Holds total price of all the items in the cart
    totalItems: {type:Number,required:true} // Holds total number of items in the cart
}
,{timestamps:true}
)

module.exports = mongoose.model('cart',cartSchema)