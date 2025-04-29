import express from "express";
import {
  test,
  signup,
  signin,
  signout,
  sendVerificationCode,
  verifyCode,
  forgotPasswordCode,
  verifyForgotPasswordCode,
  changePassword,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", test);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

router.patch("/send-verification-code", sendVerificationCode);
router.patch("/verify-code", verifyCode);
router.patch("/send-forgot-password-code", forgotPasswordCode);
router.patch("/verify-forgot-password-code", verifyForgotPasswordCode);
router.patch("/change-password", changePassword);

export default router;
