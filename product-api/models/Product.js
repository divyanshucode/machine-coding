const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type : String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    category:{
        type:String,
        required: true,
        lowercase: true,
        trim: true
    }, 
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;