import { Router } from "express";

import { verifyjwt } from "../middlewares/auth.middleware.js";
import { createorder , verifypayment} from "../controllers/order.controller.js";

const router = Router();

router.route("/createorder/:MentorId").post(  verifyjwt, createorder);
router.route("/verifypayment").post(verifypayment);

export default router