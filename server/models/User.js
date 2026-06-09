import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        trim:true
    },
    lastName: {
        type:String,
        required:true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        lowercase:true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
        minlength:6
    },
    age: {
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:""
    },
    isVerified: {
        type:Boolean,
        default:false
    },
    expiry: {
        type:Date,
        default: Date.now() + 3600000 // 1 hour from now
    },
    
    resetToken: String,
    resetTokenExpiry: Date,

    role: {
        type:String,
        enum: ["admin", "student", "trainer", "company"],
        default:"student"
    }

});

const User = mongoose.model("User", userSchema, 'user');

export default User;

