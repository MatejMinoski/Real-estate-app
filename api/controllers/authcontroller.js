import User from "../model/user.model.js";
import bcrypt from "bcryptjs"
import { errorHandler } from "../utils/error.js";
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
