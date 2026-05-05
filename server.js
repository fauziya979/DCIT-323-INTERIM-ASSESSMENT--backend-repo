const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Load .env only in local development — Render injects env vars directly
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

// Safe debug log — confirms env var is present without exposing the value
console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("ERROR: Missing required environment variables: MONGO_URI and/or JWT_SECRET");
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();