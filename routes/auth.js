const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

router.post("/register", authController.register);
router.post(
  "/register-detail",
  upload.single("imageUrl"),
  authController.registerDetail
);
router.post("/login", authController.login);
router.post("/verify-register", authController.verifyAccount);
router.post("/resend-otp", authController.resendOtp);
router.get("/all", authController.getUser);
router.get("/me", authenticate, authController.getUserById);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
