import express from "express"
import { auth, singIn,oath,signOut } from "../controllers/authcontroller.js"

const authRouter= express.Router()
authRouter.post("/signup",auth)
authRouter.post("/signin", singIn);
authRouter.post("/google",oath)
authRouter.get("/signout",signOut);
export default authRouter