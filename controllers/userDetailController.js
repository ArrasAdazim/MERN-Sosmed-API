const UserDetail = require("../models/userDetail");
const Follow = require("../models/follow");

const createUserDetail = async (req, res) => {
  const { firstName, lastName, address, bio, phone } = req.body;

  try {
    const user = await UserDetail.findOne({ userId: req.user.id });

    if (user) {
      return res.status(400).json({
        status: "BAD REQUEST",
        message: "UserDetail already exists",
        data: null,
      });
    }

    const userDetail = await UserDetail.create({
      userId: req.user.id,
      firstName,
      lastName,
      address,
      bio,
      phone,
    });

    const response = {
      status: "CREATED",
      message: "SUCCESSFULLY CREATED USER DETAIL",
      data: userDetail,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
      data: null,
    });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const userDetail = await UserDetail.findOne({
      userId: req.user.id,
    }).populate("userId", "id email");

    if (!userDetail) {
      return res.status(404).json({
        status: "NOT FOUND",
        message: "UserDetail not found",
        data: null,
      });
    }
    // Jumlah pengikut (followers)
    const followersCount = await Follow.countDocuments({
      followingId: req.user.id,
    });

    // Jumlah yang diikuti (following)
    const followingCount = await Follow.countDocuments({
      followerId: req.user.id,
    });

    const response = {
      status: "OK",
      message: "SUCCESSFULLY USER DETAIL",
      data: userDetail,
      followersCount,
      followingCount,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
      data: null,
    });
  }
};

const updateUserDetail = async (req, res) => {
  const { firstName, lastName, address, bio, phone } = req.body;

  try {
    const userDetail = await UserDetail.findOne({ userId: req.user.id });

    if (!userDetail) {
      return res.status(404).json({
        status: "NOT FOUND",
        message: "UserDetail not found",
        data: null,
      });
    }

    userDetail.firstName = firstName || userDetail.firstName;
    userDetail.lastName = lastName || userDetail.lastName;
    userDetail.address = address || userDetail.address;
    userDetail.bio = bio || userDetail.bio;
    userDetail.phone = phone || userDetail.phone;
    await userDetail.save();
    const response = {
      status: "OK",
      message: "SUCCESSFULLY UPDATED USER DETAIL",
      data: userDetail,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
      data: null,
    });
  }
};

const deleteUserDetail = async (req, res) => {
  try {
    const userDetail = await UserDetail.findOneAndDelete({
      userId: req.user.id,
    });
    if (!userDetail) {
      return res.status(404).json({
        status: "NOT FOUND",
        message: "UserDetail not found",
        data: null,
      });
    }
    res
      .status(200)
      .json({ status: "OK", message: "User deleted successfully" });
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
    const user = await UserDetail.find();
    res.status(200).json({
      status: "OK",
      message: "Successfully get data",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed get data",
      data: error.message,
    });
  }
};

module.exports = {
  createUserDetail,
  getUserDetail,
  updateUserDetail,
  deleteUserDetail,
  getAll,
};
