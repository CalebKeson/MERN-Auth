import {
  signupSchema,
  signinSchema,
  verifyVerificationCodeSchema,
  forgotPasswordCodeSchema,
  changePasswordSchema,
} from "../middleware/validation.js";
import { doHash, compareHash, hmacProcess } from "../utils/hashing.js";
import transport from "../middleware/sendMail.js";
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
          profilePic: existingUser.profilePicture,
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

export const sendVerificationCode = async (req, res, next) => {
  const { email } = req.body; // destructure the request body

  try {
    // find the user by email
    const existingUser = await User.findOne({ email });

    // if user does not exist, send a response
    if (!existingUser) {
      return next(errorHandler(404, "User does not exist!"));
    }

    // check if user is already verified
    if (existingUser.isVerified) {
      return next(errorHandler(400, "User is already verified!"));
    }

    // generate a verification code
    const verificationCode = Math.floor(Math.random() * 1000000).toString(); // 6 digit code

    // send the verification code to the user's email
    const mailOptions = {
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Verification Code",
      html: `<h2>Your verification code is ${verificationCode}</h2>`,
    };

    // send the email
    const info = await transport.sendMail(mailOptions);

    // check if email was sent successfully
    if (!info) {
      return next(errorHandler(401, "Failed to send verification code!"));
    }

    // save the verification code to the user's document
    if (info.accepted[0] === existingUser.email) {
      const hashedVerificationCode = hmacProcess(
        verificationCode,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      // save the hashed verification code to the user's document
      existingUser.verificationCode = hashedVerificationCode;
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
    }

    // send a response
    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully!",
    });
  } catch (error) {
    // handle errors
    next(error);
  }
};

export const verifyCode = async (req, res, next) => {
  const { email, verificationCode } = req.body; // destructure the request body

  try {
    // validate the request body using Joi
    const { error, value } = verifyVerificationCodeSchema.validate({
      email,
      verificationCode,
    });

    // validate the request body
    if (error) {
      return next(errorHandler(401, error.details[0].message));
    }

    // find the user by email
    const existingUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation"
    );

    // if user does not exist, send a response
    if (!existingUser) {
      return next(errorHandler(404, "User does not exist!"));
    }

    // check if user is already verified
    if (existingUser.isVerified) {
      return next(errorHandler(400, "User is already verified!"));
    }

    // check if verification code is already sent
    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return next(errorHandler(401, "Verification code not sent!"));
    }

    // check if verification code is correct
    const hashedVerificationCode = hmacProcess(
      verificationCode.toString(),
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );

    // check if verification code is expired
    const currentTime = Date.now();
    const verificationCodeValidationTime =
      existingUser.verificationCodeValidation;
    const timeDiff = currentTime - verificationCodeValidationTime;
    const timeDiffInMinutes = Math.floor(timeDiff / (1000 * 60)); // convert to minutes

    // if verification code is expired, send a response
    if (timeDiffInMinutes > 5) {
      // 5 minutes expiration time
      return next(errorHandler(401, "Verification code expired!"));
    }

    if (hashedVerificationCode !== existingUser.verificationCode) {
      return next(errorHandler(401, "Invalid verification code!"));
    }

    // update the user's document to set isVerified to true and clear the verification code
    existingUser.isVerified = true;
    existingUser.verificationCode = undefined;
    existingUser.verificationCodeValidation = undefined;

    await existingUser.save();

    // send a response
    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    // handle errors
    next(error);
  }
};

export const forgotPasswordCode = async (req, res, next) => {
  const { email } = req.body; // destructure the request body

  // forgot password logic
  try {
    // check if user exists
    const existingUser = await User.findOne({ email });

    // if user does not exist, send a response
    if (!existingUser) {
      return next(errorHandler(404, "User does not exist!"));
    }
    // generate a verification code
    const verificationCode = Math.floor(Math.random() * 1000000).toString(); // 6 digit code

    // send the verification code to the user's email
    const mailOptions = {
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Forgot Password Code",
      html: `<h2>Your forgot password code is ${verificationCode}</h2>`,
    };

    // send the email
    const info = await transport.sendMail(mailOptions);

    // check if email was sent successfully
    if (!info) {
      return next(errorHandler(401, "Failed to send verification code!"));
    }

    // save the verification code to the user's document
    if (info.accepted[0] === existingUser.email) {
      const hashedVerificationCode = hmacProcess(
        verificationCode,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      // save the hashed verification code to the user's document
      existingUser.forgotPasswordCode = hashedVerificationCode;
      existingUser.forgotPasswordCodeValidation = Date.now();
      await existingUser.save();
    }

    // send a response
    return res.status(200).json({
      success: true,
      message: "Forgot password code sent successfully!",
    });
  } catch (error) {
    // handle errors
    next(error);
  }
};

export const verifyForgotPasswordCode = async (req, res, next) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    // validate the request body using Joi
    const { error, value } = forgotPasswordCodeSchema.validate({
      email,
      verificationCode,
      newPassword,
    });

    // validate the request body
    if (error) {
      return next(errorHandler(401, error.details[0].message));
    }

    // find the user by email
    const existingUser = await User.findOne({ email }).select(
      "+forgotPasswordCode +forgotPasswordCodeValidation"
    );

    // if user does not exist, send a response
    if (!existingUser) {
      return next(errorHandler(404, "User does not exist!"));
    }

    // check if verification code is already sent
    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordCodeValidation
    ) {
      return next(errorHandler(401, "Forgot password code not sent!"));
    }

    // check if verification code is correct
    const hashedVerificationCode = hmacProcess(
      verificationCode.toString(),
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );

    // check if verification code is expired
    const currentTime = Date.now();
    const verificationCodeValidationTime =
      existingUser.verificationCodeValidation;
    const timeDiff = currentTime - verificationCodeValidationTime;
    const timeDiffInMinutes = Math.floor(timeDiff / (1000 * 60)); // convert to minutes

    // if verification code is expired, send a response
    if (timeDiffInMinutes > 5) {
      // 5 minutes expiration time
      return next(errorHandler(400, "Verification code expired!"));
    }

    if (hashedVerificationCode !== existingUser.forgotPasswordCode) {
      return next(errorHandler(401, "Invalid forgot password code!"));
    }

    // update the user's document to set isVerified to true and clear the verification code
    existingUser.password = doHash(newPassword, 10);
    existingUser.forgotPasswordCode = undefined;
    existingUser.forgotPasswordCodeValidation = undefined;

    await existingUser.save();

    // send a response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    // handle errors
    next(error);
  }
};

export const changePassword = async ( req, res, next ) => {
  const { oldPassword, newPassword } = req.body
  const { isVerified, id } = req.user // destructure the request body

  try {
    // validate the request body using Joi
    const { error, value } = changePasswordSchema.validate({
      oldPassword,
      newPassword,
    });

    // validate the request body
    if (error) {
      return next(errorHandler(401, error.details[0].message));
    }

    // check if user is verified
    if (!isVerified) {
      return next(errorHandler(401, "User is not verified!"));
    }
    // check if user exists
    const existingUser = await User.findById(id).select("+password");

    // if user does not exist, send a response
    if (!existingUser) {
      return next(errorHandler(404, "User does not exist!"));
    }

    // check if password is correct
    const isMatch = compareHash(oldPassword, existingUser.password);

    // if password is incorrect, send a response
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials!"));
    }

    // hash the new password
    const hashedPassword = doHash(newPassword, 10);

    // update the user's document to set isVerified to true and clear the verification code
    existingUser.password = hashedPassword;

    await existingUser.save();

    // send a response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    // handle errors
    next(error);
  }
}

export const googleAuth = async ( req, res, next ) => {
  const { username, email, photo } = req.body;

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });

    // if user exists, sign in the user
    if (existingUser) {
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

      // create a cookie
      // set the cookie in the response
      return res.status(200)
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
            profilePic: existingUser.profilePicture,
          },
        });
    } else {
      // generate a password
      const generatePassword = Math.random().toString(36).slice(-8); // generate a random password

      // hash the password
      const hashedPassword = doHash(generatePassword, 10);
      // create a new user
      const newUser = new User({
        username: username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
        password: hashedPassword,
        email,
        profilePicture: photo,
      });

      // save the user to the database
      const result = await newUser.save();

      // make the password undefined before sending a response
      result.password = undefined;

      // create a token
      const token = jwt.sign(
        {
          id: result._id,
          email: result.email,
          isVerified: result.isVerified,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // create a cookie
      // set the cookie in the response
      return res.status(201)
        .cookie("Authorization", `Bearer ${token}`, {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        })
        .json({
          success: true,
          message: "User created successfully!",
          user: {
            id: result._id,
            username: result.username,
            email: result.email,
            isVerified: result.isVerified,
            profilePic: result.profilePicture,
          },
        });
    }
    
  } catch (error) {
    // handle errors
    next(error);
       
  }
  
}

