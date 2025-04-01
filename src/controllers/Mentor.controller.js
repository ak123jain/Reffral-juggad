import { Mentor } from "../models/Mentor.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudniary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { log } from "console";

export const addMentor = asynchandler(async (req, res) => {
  const {
    fullname,
    email,
    company,
    designation,
    about,
    experience,
    skills,
    linkedin,
    jobtitle,
    availableForReferral
  } = req.body;

  // Avatar file from multipart form-data
   

   if ([fullname, email, company, designation, jobtitle , about, experience, skills, linkedin].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
   }

  const avatar = req.file?.path;

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required.");
  }

  // Upload avatar to Cloudinary
  const uploadedAvatar = await uploadOnCloudinary(avatar);

  if (!uploadedAvatar?.url) {
    throw new ApiError(500, "Avatar upload failed. Try again.");
  }

  // Check for existing mentor by email
  const existingMentor = await Mentor.findOne({ email });

  if (existingMentor) {
    throw new ApiError(409, "Mentor already exists with this email.");
  }

  const newMentor = await Mentor.create({
    fullname,
    email,
    avatar: uploadedAvatar.url,
    company,
    designation,
    about,
    experience,
    jobtitle,
    skills,
    linkedin,
    availableForReferral 
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, newMentor, "Mentor added successfully!")
    );
    
});


export const Getmentor = asynchandler( async (req, res) => {
  console.log("Getmentor called");
  const mentors = await Mentor.find() 

  if (!mentors) {
    throw new ApiError(404, "Mentors not found.");
  }
  console.log("Mentors fetched:", mentors);
  res.status(200).json(new ApiResponse(200, {mentors}, "Mentors fetched successfully."));
})

export const Getmentorbyid = asynchandler( async (req, res) => {

  console.log("Getmentorbyid called idddd aaaa gyiii" , req.params);
  
  const { id } = req.params;
  console.log("Getmentorbyid called with ID:", id);
  
  const mentor = await Mentor.findById(id);

  if (!mentor) {
    throw new ApiError(404, "Mentor not found.");
  }

  console.log("Mentor fetched:", mentor);
  res.status(200).json(new ApiResponse(200, { mentor }, "Mentor fetched successfully."));
})