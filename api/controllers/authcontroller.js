import User from "../model/user.model.js";
import bcrypt from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import  jwt  from "jsonwebtoken";
export const auth = async (req, res,next) => {
 const {username,email,password}=req.body
 const existingUser = await User.findOne({ $or: [{ email }, { username }] });

 if (existingUser) {
   // User already registered, return an error
   const errorMessage =
     existingUser.email === email
       ? "Email address is already registered"
       : "Username is already taken";

   return res.status(400).json({
     success: false,
     message: errorMessage,
   });
 }
 const hashedPassword = await bcrypt.hash(password, 10);

 const newUser=  new User({username,email,password:hashedPassword})
 try{
     await newUser.save()
     res.status(201).json(
    "User created successfully"
     )
  
 }catch(err){
   next(err)
 }
};
export const singIn=async(req,res,next)=>{
const {email,password}=req.body;
try {
  const validUser=await User.findOne({email})
  const validPassword=bcrypt.compareSync(password,validUser.password)
  if(!validPassword){
    return next(errorHandler(401,"Wrong credentials"))
  }
  if(!validUser){
    return next(errorHandler(404,"User not found"))
  }
  const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
  const { password: pass, ...rest } = validUser._doc;
  
  res.cookie("access_token",token,{httpOnly:true}).status(200).json(rest)
  
} catch (error) {
  next(error)
  
}
}
