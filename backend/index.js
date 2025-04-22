import express from "express";
import mongoose from "mongoose";

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

// listen to server on port 3000
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}!`);
});
