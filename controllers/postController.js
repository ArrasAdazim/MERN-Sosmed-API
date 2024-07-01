const Post = require("../models/post");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  const { content } = req.body;

  try {
    const payload = await Post.create({
      userId: req.user.id,
      content,
    });

    const response = {
      status: "CREATED",
      message: "SUCCESSFULLY CREATED POST",
      data: {
        payload,
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

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.findById(id);
    console.log("post", post);

    if (!post) {
      return res.status(404).send({
        status: "NOT FOUND",
        message: "Post not found",
        data: null,
      });
    }

    // Validasi cek apakah yang punya post
    if (post.userId.toString() !== req.userId) {
      return res.status(403).send({
        status: "FORBIDDEN",
        message: "Not authorized to delete this post",
        data: null,
      });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({
      status: "OK",
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "BAD REQUEST",
      message: error.message,
      data: null,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const post = await Post.find();
    const response = {
      status: "SUCCESSFULLY",
      message: "SUCCESSFULLY GET DATA POST",
      data: {
        post,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      status: "BAD REQUEST",
      message: error.message,
      data: null,
    });
  }
};

const getPostByUser = async (req, res) => {
  try {
    const post = await Post.findOne({ userId: req.user.id });
    const response = {
      status: "SUCCESSFULLY",
      message: "SUCCESSFULLY GET DATA POST",
      data: {
        post,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      status: "BAD REQUEST",
      message: error.message,
      data: null,
    });
  }
};

const getPostByIdUser = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.find({ userId: id });
    const response = {
      status: "SUCCESSFULLY",
      message: "SUCCESSFULLY GET DATA POST",
      data: {
        post,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      status: "BAD REQUEST",
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  createPost,
  deletePost,
  getAll,
  getPostByUser,
  getPostByIdUser,
};
