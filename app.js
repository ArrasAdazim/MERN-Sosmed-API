const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser()); // agar token tersimpan di cookies ketika login
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectDB();
});
