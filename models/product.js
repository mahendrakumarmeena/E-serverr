const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
    },
    brandName:{
        type:String,
        required:true
    },
    category:{
        type:String,  
    },
    productImage:[],
     
    description: {
      type: String,
      required:true,
    },
     createdAt: {
        type: Date,
        default: Date.now
    },
    price:{
        type:Number,
        required:true
    },
    sellingPrice:{
        type:Number,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
},{
    timeStamps:true,
})

module.exports = mongoose.model("product",productSchema);
