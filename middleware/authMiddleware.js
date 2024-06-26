const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      status: "UNATHORIZED",
      message: "Access denied. No token provided.",
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ status: "UNATHORIZED", message: "Invalid token.", data: null });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "UNATHORIZED",
      message: "Session expired, please login again",
      data: null,
    });
  }
};

module.exports = authenticate;
