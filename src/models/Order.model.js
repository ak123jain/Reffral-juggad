import mongoose from "mongoose";

const createorder = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    orderId :{
        type : String,
        required : true,
        unique : true  // razopay order id
    },
    amount :{
        type : Number,
        required : true
    },
    currency :{
        type : String,
        required : true,
        default : "INR"                                      
    },
    MentorId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Mentor",
    },
    receipt_id:{
        type : String,
        required : true
    },
    paymentId :{
        type : String,
    },
    Mentor:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Mentor",
    },
    status:{
        type : String,
        enum :["pending" , "success" , "failed"],
    },
    createdAt:{
        type : Date,
        default : Date.now
    }
} , {timestamps : true})


export const Order = mongoose.model("Order" , createorder)