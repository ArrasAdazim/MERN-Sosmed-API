const { get } = require("mongoose");
const Bookmark = require("../models/bookmark");

const createBookmark = async (req, res) => {
  const postId = req.params.id;
  console.log("id", postId);
  try {
    const bookmark = await Bookmark.create({ userId: req.user.id, postId });
    const response = {
      status: "CREATED",
      message: "SUCCESSFULLY CREATED BOOKMARK POST",
      data: {
        bookmark,
      },
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({
      status: "BAD REQUEST",
      message: error.message,
      data: null,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const bookmark = await Bookmark.find({ userId: req.user.id }).populate(
      "postId",
      "id content"
    );
    const response = {
      status: "SUCCESSFULLY",
      message: "SUCCESSFULLY GET BOOKMARK POST",
      data: {
        bookmark,
      },
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({
      status: "BAD REQUEST",
      message: error.message,
      data: null,
    });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const id = req.params.id;
    const bookmark = await Bookmark.findById(id);

    if (!bookmark) {
      return res.status(404).send({
        status: "NOT FOUND",
        message: "Bookmark not found",
        data: null,
      });
    }

    if (bookmark.userId.toString() !== req.userId) {
      return res.status(403).send({
        status: "FORBIDDEN",
        message: "Not authorized to delete this post",
        data: null,
      });
    }

    await Bookmark.findByIdAndDelete(id);

    res.status(200).json({
      status: "OK",
      message: "Bookmark Post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "BAD REQUEST",
      message: error.message,
      data: null,
    });
  }
};

module.exports = { createBookmark, getMe, deleteBookmark };
