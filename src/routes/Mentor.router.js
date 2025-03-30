import { Router } from "express"
import { addMentor } from "../controllers/Mentor.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addmentor").post(
    upload.single("avatar"),
    addMentor
)

export default router