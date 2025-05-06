import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from "../firebase";
import { loginSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux"
import {useNavigate} from "react-router-dom"


const GoogleAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = async () => {
      try {
        const provider = new GoogleAuthProvider()
        const auth = getAuth(app)
        const result = await signInWithPopup(auth, provider)
        const res = await fetch("api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          })
        })
        const data = await res.json()
        console.log("Google login data", data)
        dispatch(loginSuccess(data))
        navigate("/")
      } catch (err) {
        console.log("Failed to login with Google", err)
      }
  }


  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-red-700 text-white p-3 rounded-lg cursor-pointer uppercase hover:opacity-95 disabled:opacity-80"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleAuth;
// This component is a simple Google authentication button.
