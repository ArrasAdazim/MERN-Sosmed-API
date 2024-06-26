const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  createUserDetail,
  getUserDetail,
  updateUserDetail,
  deleteUserDetail,
} = require("../controllers/userDetailController");

router.post("/", authenticate, createUserDetail);
router.get("/", authenticate, getUserDetail);
router.put("/", authenticate, updateUserDetail);
router.delete("/", authenticate, deleteUserDetail);

module.exports = router;
