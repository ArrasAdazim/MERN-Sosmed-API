const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userDetailRoutes = require("./routes/userDetail");
const followRoutes = require("./routes/followRoute");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cookieParser()); // agar token tersimpan di cookies ketika login
const PORT = process.env.PORT || 3000;
app.use(cors());

// connectDB;

const DATABASE = process.env.DATABASE;

mongoose
  .connect(DATABASE)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user-details", userDetailRoutes);
app.use("/api", followRoutes);
app.get("/", function (req, res) {
  res.send("Hello World! ");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectDB();
});
