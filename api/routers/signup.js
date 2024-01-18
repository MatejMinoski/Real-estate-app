import express from "express"
import { auth } from "../controllers/authcontroller.js"

const authRouter= express.Router()
authRouter.post("/signup",auth)
export default authRouter