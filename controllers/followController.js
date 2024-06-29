const Follow = require("../models/follow");
const mongoose = require("mongoose");

const createFollow = async (req, res) => {
  const followingId = req.params.id; // id Target yang ingin di follow
  const followerId = req.userId; // id yang login

  if (followerId === followingId) {
    return res.status(400).json({
      status: "ERROR",
      message: "You cannot follow/unfollow yourself",
      data: null,
    });
  }

  try {
    const checkFollow = await Follow.findOne({
      followingId: new mongoose.Types.ObjectId(followingId),
      followerId: new mongoose.Types.ObjectId(followerId),
    });

    if (checkFollow) {
      await Follow.deleteOne({ _id: checkFollow._id });
      return res
        .status(200)
        .json({ status: "SUCCESSFULLY", message: "Unfollowed successfully" });
    } else {
      const follow = new Follow({
        followerId: new mongoose.Types.ObjectId(followerId),
        followingId: new mongoose.Types.ObjectId(followingId),
      });
      await follow.save();
      return res.status(201).json(follow);
    }
  } catch (error) {
    console.log("test", error);
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: "Internal server error",
      data: null,
    });
  }
};

const countFollowers = async (req, res) => {
  const userId = req.userId;

  try {
    const count = await Follow.countDocuments({ followingId: userId });
    res.status(200).json({
      status: "SUCCESS",
      message: "Successfully retrieved followers count",
      data: {
        count: count,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: "Internal server error",
      data: null,
    });
  }
};

const countFollowing = async (req, res) => {
  const userId = req.userId;

  try {
    const count = await Follow.countDocuments({ followerId: userId });
    res.status(200).json({
      status: "SUCCESS",
      message: "Successfully retrieved following count",
      data: {
        count: count,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: "Internal server error",
      data: null,
    });
  }
};

module.exports = { createFollow, countFollowers, countFollowing };
