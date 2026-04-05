const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    username :{
        type : String,
        required: true
    },
    email:{
        type : String,
        required: true,
        unique : true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password:{
        type : String,
        required:true,
        minlength: 6
    },
    role:{
        type : String,
        enum: ["viewer", "analyst", "admin"],
        default: "viewer",
    },
    isActive:{
        type: Boolean,
        default: true
    },
    createdAt :{
        type : Date,
        default : Date.now
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("User",userSchema)