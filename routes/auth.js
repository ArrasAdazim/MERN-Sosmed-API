const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-register", authController.verifyAccount);
router.post("/resend-otp", authController.resendOtp);
router.get("/all", authController.getUser);
router.get("/me", authenticate, authController.getUserById);

module.exports = router;
