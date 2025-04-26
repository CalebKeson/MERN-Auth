import express from "express";
import {
  test,
  signup,
  signin,
  signout,
  sendVerificationCode,
  verifyCode,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", test);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

router.patch("/send-verification-code", sendVerificationCode);
router.patch("/verify-code", verifyCode);

export default router;
