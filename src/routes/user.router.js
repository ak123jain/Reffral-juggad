import { Router } from "express";
import { registeruser , loggedinuser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";

const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar" }]), registeruser);
router.route("/loggedinuser").post(
    upload.any(),
    loggedinuser
);


//app.use(upload.any()); // This will parse form-data correctly

export default router;