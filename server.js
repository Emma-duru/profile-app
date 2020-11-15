require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

// Import router
const userRoutes = require("./routes/userRoutes");

// Set up view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to mongoDB
mongoose.connect(process.env.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    (err) => {
        if(err) throw err;
        console.log("Connected to MongoDB")
    });

// Use routes
app.use("*", checkUser);
app.use(userRoutes);

// Start the server
app.listen(process.env.PORT, (err) => {
    if(err) throw err;
    console.log("Server is running");
})