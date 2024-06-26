const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/otp");
const sendOtp = require("../utils/email");
require("dotenv").config();
const User = require("../models/user");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        status: "BAD REQUEST",
        message: "Email is already registered",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
    await sendOtp(email, otp);
    res.status(201).json({
      status: "CREATED",
      message: "User registered. Check your email for OTP.",
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: "BAD REQUEST", message: err.message, data: null });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user || user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        status: "BAD REQUEST",
        message: "Invalid or expired OTP",
        data: null,
      });
    }
    user.otp = null;
    user.otpExpiresAt = null;
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      status: "OK",
      message: "OTP verified. You can now login.",
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "BAD REQUEST", message: error.message, data: null });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "BAD REQUEST", message: "Invalid email", data: null });
    }

    if (user.isVerified == true) {
      return res.status(400).json({
        status: "BAD REQUEST",
        message: "Account already verified",
        data: null,
      });
    }
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
    await sendOtp(email, otp);

    res.status(200).json({ status: "OK", message: "Check your email for OTP" });
  } catch (error) {
    res
      .status(400)
      .json({ status: "BAD REQUEST", message: error.message, data: null });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "BAD REQUEST", message: "Invalid email", data: null });
    }
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    user.isForget = true;
    await user.save();
    await sendOtp(email, otp);

    res.status(200).json({
      status: "OK",
      message: "Check your email for OTP to reset password",
      data: null,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "BAD REQUEST", message: error.message, data: null });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user || user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        status: "BAD REQUEST",
        message: "Invalid or expired OTP",
        data: null,
      });
    }

    const password = await bcrypt.hash(newPassword, 10);

    user.password = password;
    user.otp = null;
    user.otpExpiresAt = null;
    user.isForget = false;
    await user.save();

    res
      .status(200)
      .json({ status: "OK", message: "Password reset successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ status: "BAD REQUEST", message: error.message, data: null });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Invalid password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: "FORBIDDEN",
        message: "Account not verified. Please verify your account first.",
        data: null,
      });
    }

    if (user.isForget) {
      return res.status(403).json({
        status: "FORBIDDEN",
        message:
          "Account forget password. Please change password your account first.",
        data: null,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookies
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    // });
    // res.json({ message: "Login successful" });
    const response = {
      status: "OK",
      message: "Login Succesfully",
      data: {
        email: email,
        token: token,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Login Failed",
      data: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.find({});
    res
      .status(200)
      .json({ status: "OK", message: "Successfully get data", data: user });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed get data",
      data: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("data user : ", user);
    res
      .status(200)
      .json({ status: "OK", message: "Successfully get data", data: user });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed get data",
      data: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  verifyAccount,
  resendOtp,
  getUser,
  getUserById,
  resetPassword,
  forgetPassword,
};
