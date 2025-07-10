const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { readdirSync } = require("fs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const corsOption = require("./utils/corsOption");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};
connectDB();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsOption);

readdirSync("./routes").map((route) => {
  app.use("/product", require(`./routes/${route}`));
});

async function startServer() {
  // await connectToDB();
  app.listen(4000, () => console.log("Server Up and running"));
}

startServer();
