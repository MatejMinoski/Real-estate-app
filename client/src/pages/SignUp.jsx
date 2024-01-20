import { useState } from "react"
import React  from 'react'
import {Link,useNavigate} from "react-router-dom"
import OAuth from "../components/OAuth"
export default function SignUp() {
const [formData,setFomData]=React.useState({})
const [error,setError]=React.useState(null)
const [loading,setLoading]=React.useState(false)
const navigate=useNavigate()
const handleChange=(e)=>{
setFomData({
  ...formData,
  [e.target.id]:e.target.value
})
}

  const validateForm = () => {
    const { username, email, password } = formData;

    // Check if required fields are filled
    if (!username || !email || !password) {
      setError("Please fill all the information");
      return false;
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate password format using regex (add your password requirements)
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include at least one uppercase letter, one number, and one special character (@$!%*?&)"
      );
      return false;
    }

    setError(null); // Reset error state if all checks pass
    return true;
  };


const handleSubmit=async (e)=>{
e.preventDefault()
if(!validateForm()){
return;
}
try {
  
  setLoading(true)
  
  const res=await fetch("/api/auth/signup",{
    method:"POST",
    headers:{
      'Content-type':'application/json',
    },
    body:JSON.stringify(formData),
  
  });
  const data=await res.json()
  if (!res.ok) {
    // Check for specific error messages indicating user already registered
    if (data.message.includes("already registered")) {
      setError("You have already registered. Please log in.");
    } else {
      setError(data.message);
    }

    setLoading(false);
    return;
  }
  if(data.success==false){
    setError(data.message)
    setLoading(false)
    return;
  }
  setLoading(false)
  setError(null)
  navigate("/sign-in")
  console.log(data)
} catch (error) {
  setLoading(false)
  setError(error.message)
}
}
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold mt-8 my-7">SignUp</h1>
      <form  className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="outline-none border p-3 rounded-lg"
          id="username" 
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="outline-none border p-3 rounded-lg"
          id="email" 
         onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="outline-none border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg cursor-pointer uppercase hover:opacity-95 disabled:opacity-80">
          
         {loading?"Loading...": "Sign Up" }
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5" >{error}</p>}
    </div>
  );
}
