const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  createFollow,
  countFollowers,
  countFollowing,
} = require("../controllers/followController");

router.post("/follow/:id", authenticate, createFollow);
// Endpoint untuk menghitung jumlah followers berdasarkan userId
router.get("/followers/:id", countFollowers);

// Endpoint untuk menghitung jumlah following berdasarkan userId
router.get("/following/:id", countFollowing);

module.exports = router;
