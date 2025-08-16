const mongoose = require('mongoose');

const addToCart = mongoose.Schema({
    productId:{
        type:String,
        ref:'product',
    },
    quantity:{
        type:Number,
    },
    userId:{
        type:String,
    }
},{
    timeStamps:true,
});

module.exports = mongoose.model("addToCart",addToCart)