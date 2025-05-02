import React, { useState } from "react";
import { useNavigate} from 'react-router-dom'
const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/new-password")
  }

  return (
    <div className="max-w-lg mx-auto p-16">
      <h1 className="text-3xl font-semibold text-center my-8">
        Reset Password
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="uppercase text-gray-600">Your email</label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="name@gmail.com"
          className="bg-slate-100 p-3 rounded-lg"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
        
          type="submit"
          className="bg-slate-700 p-3 rounded-lg text-white cursor-pointer uppercase hover:opacity-95 disabled:opacity-80"
        >
          submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordEmail;
