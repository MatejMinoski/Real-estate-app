import User from "../model/user.model.js";
import bcrypt from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import  jwt  from "jsonwebtoken";
export const auth = async (req, res,next) => {
 const {username,email,password}=req.body
 const existingUser = await User.findOne( {$or: [{ email }, { username }]} );

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
   if (!validUser) {
     return next(errorHandler(404, "User not found"));
   }
  const validPassword=bcrypt.compareSync(password,validUser.password)
  if(!validPassword){
    return next(errorHandler(401,"Wrong credentials"))
  }
 
  const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
  const { password: pass, ...rest } = validUser._doc;
  
  res.cookie("access_token",token,{httpOnly:true}).status(200).json(rest)
  
} catch (error) {
  next(error)
   
}
}
export const oath = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatePassword, 10);
      const username = req.body.username
        ? req.body.username.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4)
        : "";
      const newUser = new User({
        username,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
export const signOut=(req,res,next)=>{
  try {
  res.clearCookie("access_token");
  res.status(200).json("User has been logged out")
  } catch (error) {
    next(error)
  }

}
