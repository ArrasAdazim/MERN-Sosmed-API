const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

const {
  createBookmark,
  getMe,
  deleteBookmark,
} = require("../controllers/bookmarkController");

router.post("/:id", authenticate, createBookmark);
router.get("/", authenticate, getMe);
router.delete("/:id", authenticate, deleteBookmark);

module.exports = router;
