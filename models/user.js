const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        // trim: true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,  
    },
    profilePic:{
        type:String,
        default: "", // optional
    },
     role: {
      type: String,
      enum: ["GENERAL", "ADMIN"],
      default: "GENERAL",
    },
     createdAt: {
        type: Date,
        default: Date.now
    }

},{
    timeStamps:true,
})

module.exports = mongoose.model("user",userSchema);