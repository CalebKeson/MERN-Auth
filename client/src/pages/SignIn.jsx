import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice";
import GoogleAuth from "../components/GoogleAuth";

const Signup = () => {
  const [formdata, setFormdata] = useState({});

  const { isLoading: loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(loginFailure(data));
        return;
      }
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      loginFailure(error);
    }

    // setFormdata({});
  };
  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-3xl font-semibold text-center my-10">Welcome back</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 p-3 rounded-lg"
          value={formdata.email || ""}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 p-3 rounded-lg"
          value={formdata.password || ""}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 p-3 rounded-lg text-white cursor-pointer uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <GoogleAuth />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 my-4">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <Link to="/forgot-password">
          <span className="text-blue-500 cursor-pointer hover:text-blue-800">
            Forgot Password?
          </span>
        </Link>
        </div>
      </form>

      <div className="flex gap-2 my-2">
        <p>Dont have account? </p>
        <Link to="/sign-up">
          <span className="text-blue-500 cursor-pointer hover:text-blue-800">
            Sign Up
          </span>
        </Link>
        
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg my-4">
          {error
            ? error.message || "Something went wrong"
            : "Something went wrong"}
        </div>
      )}
    </div>
  );
};

export default Signup;
