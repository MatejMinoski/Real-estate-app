import React from 'react'
import { useSelector } from 'react-redux'
import { useRef,useState ,useEffect} from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import {updateUserStart,updateUserFailure,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutFailure,signOutStart,signOutSuccess} from "../redux/user/userStore"
import { useDispatch } from 'react-redux';
import { app } from '../firebase';
export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [errors, setError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSucces,setUpdateSuccess]=useState(false)
  const dispatch = useDispatch();

 
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  // firebaseStorage
  //allow read;
  //  allow write:if
  //request.resource.size<2*1024*1024 &&
  //request.resource.contentType.matches('/image/.*')
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
 const handleDeleteUser = async () => {
   try {
     dispatch(deleteUserStart());
     const res = await fetch(`/api/user/delete/${currentUser._id}`, {
       method: "DELETE",
     });
     const data = await res.json();
     if (data.success === false) {
       dispatch(deleteUserFailure(data.message));
       return;
     }
     dispatch(deleteUserSuccess(data));
   } catch (error) {
     dispatch(deleteUserFailure(error.message));
   }
 };
 const handleSignOut=async()=>{
  
  try {
   
    dispatch(signOutStart());
    const res=await fetch('/api/auth/signout')
    const data=await res.json()
    if(data.success===false){
       dispatch(signOutFailure(data.message))
       return;
    }
    dispatch(signOutSuccess(data.message))
  } catch (error) {
    dispatch(signOutFailure(data.message))
    
  }
 }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover self-center hover:cursor-pointer mt-2"
        ></img>
        <p className="text-sm self-center">
          {errors ? (
            <span className="text-red-700">
              Error image upload ( must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc == 100 ? (
            <span className="text-green-700">Uploaded sucessfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          className="outline-none border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="outline-none border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="outline-none border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg cursor-pointer uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span className="text-red-500 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      <p className="text-red-500 mt-5">{error ? error : ""}</p>
      <p className="text-green-500 mt-5">
        {updateSucces ? "User is updated sucessfully" : ""}
      </p>
    </div>
  );
}
