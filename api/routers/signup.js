import express from "express"
import { auth, singIn } from "../controllers/authcontroller.js"

const authRouter= express.Router()
authRouter.post("/signup",auth)
authRouter.post("/signin", singIn);
export default authRouter