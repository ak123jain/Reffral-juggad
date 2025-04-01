import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const verifyjwt = async (req, _ , next) =>{
    

   try {

    
    

    console.log("token iiiii 💕💕",req.header("Authorization"));

    console.log("cookies are present 💕💕",req.cookies);

     const token = req.header("Authorization").replace("Bearer "," ").trim()
 
     console.log("Extracted token:", token);
 
         console.log("akash token is required " , token);
          
          if (!token) {
              throw new ApiError(400, "token is required")
          }
          console.log("reach heresssssssssss");

          
 
          const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            console.log("decoded token is hereeeeee", decodedtoken);
 
          const user = await User.findById(decodedtoken.id).select("-password -refreshtoken");
 
          console.log("user find lllllllllllll😍😍😍",user);
          
          if (!user) {
              throw new ApiError(200,"user is not found  akshu")
          }
  
          req.user = user;
  
          next();
   } catch (error) {
    throw new ApiError(401, "unauthorized beataaa")
   }

}