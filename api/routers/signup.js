import express from "express"
import { auth, singIn,oath } from "../controllers/authcontroller.js"

const authRouter= express.Router()
authRouter.post("/signup",auth)
authRouter.post("/signin", singIn);
authRouter.post("/google",oath)
export default authRouter