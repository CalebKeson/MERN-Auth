import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
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
      dispatch(signUpStart());
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signUpFailure(data));
        return;
      }
      dispatch(signUpSuccess(data));
      navigate("/sign-in");
    } catch (error) {
      dispatch(signUpFailure(error));
    }

    // setFormdata({});
  };
  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-3xl font-semibold text-center my-10">
        Create Account
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="bg-slate-100 p-3 rounded-lg"
          value={formdata.username || ""}
          onChange={handleChange}
        />
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <GoogleAuth />
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="termsandconditions" />
          <label htmlFor="remember">
            I agree to the{" "}
            <Link to="/terms-and-conditions">
              <span className="text-blue-500 cursor-pointer hover:text-blue-800">
                Terms and Conditions
              </span>
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy">
              <span className="text-blue-500 cursor-pointer hover:text-blue-800">
                Privacy Policy
              </span>
            </Link>
          </label>
        </div>
      </form>
      
        <div className="flex gap-2 my-4">
          <p>Already have account? </p>
          <Link to="/sign-in">
            <span className="text-blue-500 cursor-pointer hover:text-blue-800">
              Sign In
            </span>
          </Link>
        </div>
        
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg my-4">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default Signup;
