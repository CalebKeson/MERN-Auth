import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-3xl font-semibold text-center my-10">
        Create Account
      </h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="bg-slate-100 p-3 rounded-lg"
        />
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 p-3 rounded-lg"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 p-3 rounded-lg"
        />
        <button
          type="submit"
          className="bg-slate-700 p-3 rounded-lg text-white cursor-pointer uppercase hover:opacity-95 disabled:opacity-80"
        >
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 my-4">
        <p>Already have account? </p>
        <Link to="/sign-in">
          <span className="text-blue-500 cursor-pointer hover:text-blue-800">
            Sign In
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
