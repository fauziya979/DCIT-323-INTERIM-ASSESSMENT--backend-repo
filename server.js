require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

const authRoutes = require("./routes/authRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");

app.use("/api", authRoutes);
app.use("/api", cryptoRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing");
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

startServer();