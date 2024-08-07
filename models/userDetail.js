const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
    },
    phone: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: "https://placehold.co/600x400.png",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserDetail = mongoose.model("UserDetail", UserDetailSchema);
module.exports = UserDetail;
