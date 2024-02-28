import express from "express"
import { test, updateUser } from "../controllers/controller.js"
import { verifyToken } from "../utils/verifyUser.js"
import { deleteUser } from "../controllers/controller.js"
const userRouter=express.Router()
userRouter.get("/test",test)
userRouter.post("/update/:id",verifyToken, updateUser)
userRouter.delete("/delete/:id",verifyToken,deleteUser)
export default userRouter