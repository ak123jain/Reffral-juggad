import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js"; 
 
 
import Razorpay from "razorpay";
import { Order } from "../models/Order.model.js";
import crypto from "crypto";

const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    export const createorder = asynchandler(async (req, res) => {
        const   {amount}   = req.body;
        const  {  MentorId} = req.params;
        const userId = req.user._id;

        console.log("amount", amount);
        console.log(" MentorId", MentorId);
        console.log("userId", userId);
        

        if(!amount || !MentorId || !userId){
            throw new ApiError(400, "All fields are required");
        }

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_receipt",
        };

        const order = await razorpay.orders.create(options);

        const neworder = new Order({
            userId,
            orderId : order.id,
            amount ,
            receipt_id: `rec_${new Date().getTime()}`,//A receipt ID is a unique identifier you create for each order to track transactions in your databas
            status: "pending",
            MentorId
        })

        await neworder.save()

        return res.status(200).json(
            new ApiResponse(200, neworder, "Order created successfully")
        )
        

    })

    export const verifypayment = asynchandler(async (req, res) => {

        const {reazorpay_payment_id, razorpay_order_id , razorpay_signature , userId , MentorId} = req.body;

        const order = await Order.findOne({orderId : razorpay_order_id});

        if(!order){
            throw new ApiError(404, "Order not found");
        }

          // Step 2: Validate the Razorpay signature
          const secret = process.env.RAZORPAY_KEY_SECRET;

          const generated_signature = crypto
          .createHash("sha256", secret)
          .update(razorpay_order_id + "|" + reazorpay_payment_id)
          .digest("hex")

          if (generated_signature !== razorpay_signature) {
            throw new ApiError(400, "Invalid signature");
          }

          // payment is verified
          // update ordermstaus from pending to success

          order.status = "success";
          order.paymentId = reazorpay_payment_id;

          await order.save();

          // gramt cource to user

          const user = await User.findByIdAndUpdate(userId ,
            {
                $addToSet:{
                    enrolledCourses : MentorId
                }
            },
            {
                new: true
            }
          )


          return res.status(200).json(new ApiResponse(200, order, "Payment verified successfully"));

    })