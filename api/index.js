import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routers/router.js"
import authRouter from "./routers/signup.js"
import cookieParser from "cookie-parser"
import listingRouter from "./routers/listing-route.js"
dotenv.config()
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to mongo")
}).catch((err)=>{
console.log(err)
})
const app=express()
app.use(cookieParser());
app.listen(3000 ,()=>{
console.log("Service is running on port 3000")
})
app.use(express.json())
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)



app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500
    const message =err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message

    })
})