import { signupSchema } from "../middleware/validation.js";
import { doHash } from "../utils/hashing.js";
import User from "../models/user.model.js";
export const test = (req, res) => {
  res.json({ message: "Welcome to MERN Authentication API!!" });
};

export const signup = async (req, res) => {
  // signup logic
  const { username, email, password } = req.body; // destructure the request body
  try {
    // validate the request body using Joi
    const { error, value } = signupSchema.validate({username, email, password});

    // validate the request body
    if (error) {
      res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });

    // if user exists, send a response
    if (existingUser) {
      res.status(401).json({ success: false, message: "User already exists!" });
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
    res
      .status(201)
      .json({ success: true, message: "User created successfully!", result });
  } catch (error) {
    // handle errors
    res.status(500).json({ success: false, message: error.message });
  }
};
