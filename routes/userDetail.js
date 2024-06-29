const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  createUserDetail,
  getUserDetail,
  updateUserDetail,
  deleteUserDetail,
  getAll,
} = require("../controllers/userDetailController");

router.post("/", authenticate, createUserDetail);
router.get("/me", authenticate, getUserDetail);
router.put("/", authenticate, updateUserDetail);
router.delete("/", authenticate, deleteUserDetail);
router.get("/all", getAll);

module.exports = router;
