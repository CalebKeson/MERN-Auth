import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// create an express app
const app = express();

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

// inform the app to use JSON
app.use(express.json());

// inform the app to use urlencoded data
app.use(express.urlencoded({ extended: true }));

// inform the app to use cors
app.use(cors());

// inform the app to use cookie-parser
app.use(cookieParser());

// listen to server on port 3000
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}!`);
});

app.use("/api/auth", authRoutes);

// middleware to handle errors
// this middleware will be called if any error occurs in the app
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, message, statusCode });
});
