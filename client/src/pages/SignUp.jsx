import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formdata, setFormdata] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError("Something went wrong. Please try again.");
        return;
      }
      
    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    }

    setFormdata({ formdata });
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
          {error}
        </div>
      )}
    </div>
  );
};

export default Signup;
