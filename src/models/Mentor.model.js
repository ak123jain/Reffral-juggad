import mongoose from "mongoose";

const mentorschema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        
    },    
    avatar:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    experience:{
        type: Number,
        required:true
    },
    skills:{
        type:String,
        required:true
    },
    linkedin:{
        type:String,
        required:true
    },
    availableForReferral:{
        type:Boolean,
        required:true,
        default: true
    },
    jobtitle:{
        type:String,
        required:true
    }
} , { timestamps: true });

export const Mentor = mongoose.model("Mentor", mentorschema);