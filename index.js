const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./routes/auth');
const Product = require('./routes/product');

const app = express();
const PORT = process.env.PORT || 7000;

// ✅ CORRECT CORS SETUP
// Increase payload limit
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

// Routes

app.use("/api", User);
app.use("/api", Product);
// Start server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
