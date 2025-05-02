import React, { useState } from "react";
const NewPassword = () => {
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-lg mx-auto p-16">
      <h1 className="text-3xl font-semibold text-center my-8">
        New Password
      </h1>
      <form className="flex flex-col gap-4">
        <label className="uppercase text-gray-600">Your password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          className="bg-slate-100 p-3 rounded-lg"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-slate-700 p-3 rounded-lg text-white cursor-pointer uppercase hover:opacity-95 disabled:opacity-80"
        >
          save
        </button>
      </form> 
    </div>
  );
};

export default NewPassword;
