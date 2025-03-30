import mongoose from "mongoose";

const messgeSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    } ,
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
     content : {
        type : String,
        required : true
    }
} , {timestamps : true})

export const Messege = mongoose.model("Messege" , messgeSchema);