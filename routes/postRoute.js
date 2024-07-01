const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  createPost,
  deletePost,
  getAll,
  getPostByUser,
  getPostByIdUser,
} = require("../controllers/postController");

router.post("/", authenticate, createPost);
router.delete("/:id", authenticate, deletePost);
router.get("/all", getAll);
router.get("/me", authenticate, getPostByUser);
router.get("/:id", getPostByIdUser);
module.exports = router;
