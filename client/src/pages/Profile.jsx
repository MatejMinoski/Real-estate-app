import React from 'react'
import { useSelector } from 'react-redux'
import { useRef,useState ,useEffect} from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
export default function Profile() {
  const {currentUser} = useSelector(state=>state.user)
  const fileRef=useRef(null);
  const [file,setFile]=useState(undefined)
  const [filePerc,setFilePerc] = useState(0)
  const [error,setError]=useState(false)
  const [formData,setFormData]= useState({})
  console.log(formData)
console.log(filePerc)
console.log(error)
  useEffect(()=>{
  if(file){
 handleFileUpload(file);
  }
 
},[file])
     // firebaseStorage
      //allow read;
        //  allow write:if
          //request.resource.size<2*1024*1024 &&
          //request.resource.contentType.matches('/image/.*')
const handleFileUpload=(file)=>{
 const storage=getStorage(app);
 const fileName=new Date().getTime() + file.name
 const storageRef=ref(storage,fileName)
 const uploadTask=uploadBytesResumable(storageRef,file)
 uploadTask.on("state_changed",(snapshot)=>{
  const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100
  setFilePerc(Math.round(progress))
 },
 (error)=>{
    setError(true)
 },
 ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then
    ((downloadURL)=>{
        setFormData({...formData,avatar:downloadURL})
    })
 }
 );
}
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          onClick={()=>fileRef.current.click() }
          className="rounded-full h-24 w-24 object-cover self-center hover:cursor-pointer mt-2"
        ></img>
        <p className='text-sm self-center'>
          {error ?( <span className='text-red-700'>Error image upload ( must be less than 2 mb)</span>)
          :
         filePerc>0 && filePerc<100 ? (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>)
          :
          filePerc==100 ?
          (<span className='text-green-700'>Uploaded sucessfully</span>)
          :""
          }

        </p>
        <input
          type="text"
          placeholder="Username"
          className="outline-none border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="outline-none border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="outline-none border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg cursor-pointer uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
        <div className='flex justify-between mt-5'>
          <span className="text-red-500 cursor-pointer">Delete</span>
          <span className="text-red-500 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
}
