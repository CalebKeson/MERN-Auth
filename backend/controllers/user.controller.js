import { signupSchema, signinSchema } from "../middleware/validation.js";
import { doHash, compareHash } from "../utils/hashing.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const test = (req, res) => {
  res.json({ message: "Welcome to MERN Authentication API!!" });
};

export const signup = async (req, res, next) => {
  // signup logic
  const { username, email, password } = req.body; // destructure the request body
  try {
    // validate the request body using Joi
    const { error, value } = signupSchema.validate({
      username,
      email,
      password,
    });

    // validate the request body
    if (error) {
      return next(errorHandler(401, error.details[0].message));
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });

    // if user exists, send a response
    if (existingUser) {
      return next(errorHandler(401, "User already exists!"));
    }

    // hash the password
    const hashedPassword = doHash(password, 10);

    // create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // save the user to the database
    const result = await newUser.save();

    // make the password undefined before sending a response
    result.password = undefined;

    // send a response
    return res
      .status(201)
      .json({ success: true, message: "User created successfully!", result });
  } catch (error) {
    // handle errors
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body; // destructure the request body

  try {
    // validate the request body using Joi
    const { error, value } = signinSchema.validate({
      email,
      password,
    });

    // validate the request body
    if (error) {
      return next(errorHandler(401, error.details[0].message));
    }

    // check if user exists
    const existingUser = await User.findOne({ email }).select("+password");

    // if user does not exist, send a response
    if (!existingUser) {
      return next(errorHandler(401, "User does not exist!"));
    }

    // check if password is correct
    const isMatch = compareHash(password, existingUser.password);

    // if password is incorrect, send a response
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials!"));
    }

    // create a token
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        isVerified: existingUser.isVerified,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // make the password undefined before sending a response
    // const { password: hashedPassword, ...user } = existingUser._doc;
    // create a cookie
    // set the cookie in the response
    return res
      .cookie("Authorization", `Bearer ${token}`, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      })
      .json({
        success: true,
        message: "User logged in successfully!",
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          isVerified: existingUser.isVerified,
        },
      });
  } catch (error) {
    // handle errors
    next(error);
  }
};

export const signout = async (req, res, next) => {
  // signout logic
  try {
    // clear the cookie
    return res
      .clearCookie("Authorization")
      .json({ success: true, message: "User logged out successfully!" });
  } catch (error) {
    // handle errors
    next(error);
  }
}; 