import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Messege } from "../models/messege.model.js";
import { User } from "../models/user.model.js";
import { Mentor } from "../models/Mentor.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const sendmessege = asynchandler(async(req , res)=>{
    const {   content} = req.body;
    const { receiverId } = req.params;

    console.log("req.body", req.body);
    console.log("req.params", req.params);

    if(!receiverId || !content){
        throw new ApiError(400 , "All fields are required")
    }

    const sender = req.user._id;

    // Check if the receiver exists
    // const receiverUser = await Mentor.findById(receiverId);
    const receiverUser = await Mentor.findOne({ _id: receiverId });


    if (!receiverUser) {
        throw new ApiError(404, "Receiver not found");
    }

    // check if the sednder exist 
    const senderUser = await User.findById(sender);
    if (!senderUser) {
        throw new ApiError(404, "Sender not found");
    }

    
    const messege = await Messege.create({
        sender,
        receiver : receiverUser,
        content
    })


  // Emit the message to the receiver (private messaging)
// send messege to the servert and server emit to the all receiver

// console.log("Checking req.io inside sendmessege:", req.io);


  if (req.io) {
    req.io.to(receiverId.toString()).emit("receiveMessage", messege);
} else {
    console.log("Socket.io instance (req.io) is undefined. Message not emitted.");
}


console.log("messege is sent to the receiver", messege);



const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // ✅ Correct Model Name


const prompt = `

    You are a helpful assistant. You will be given a message and you need to respond to it in a friendly manner.
    Here is the message: "${content}"  in only 3 line `

    let reply =  " ";


    try {
        const response = await model.generateContent(prompt)

        console.log("🟢 AI Raw Response:", JSON.stringify(response, null, 2));  // ✅ Log entire AI response

        if (!response.response || !response.response.candidates || response.response.candidates.length === 0) {
            throw new Error("Invalid or empty response from Gemini AI");
        }
    
        
         reply = response.response.candidates[0]?.content?.parts[0]?.text || "No explanation available";

        

    } catch (error) {
        console.log("Error generating reply:", error);
    }


    const aimessege = await Messege.create({
        sender: receiverUser._id,
        receiver: senderUser,
        content: reply,
    })


    if (req.io) {
        req.io.to(senderUser._id.toString()).emit("receiveMessage", aimessege);
    }

    //  receiver send the messege to server and server emit to the receiver

    console.log("AI messege is sent to the sender", aimessege);
    console.log("sender messege is sent to the receiver and receiver send to ai", messege);
    
 
    res.status(200).json(
        new ApiResponse(200 , true , "messege sent successfully" , {messege , aimessege})
    )

})