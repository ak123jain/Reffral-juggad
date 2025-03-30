import { Router } from "express";
import { sendmessege } from "../controllers/messege.controller.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";   
import { Messege } from "../models/messege.model.js";       

const router = Router();

router.route("/:receiverId/sendmessege").post(
    verifyjwt,
    sendmessege)

export default router;