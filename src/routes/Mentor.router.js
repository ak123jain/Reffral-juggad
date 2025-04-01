import { Router } from "express"
import { addMentor , Getmentor, Getmentorbyid } from "../controllers/Mentor.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addmentor").post(
    upload.single("avatar"),
    addMentor
)

router.route("/getmentor").get(
    verifyjwt,
    Getmentor 
)

router.route("/getmentor/:id").get(
    Getmentorbyid
)

export default router