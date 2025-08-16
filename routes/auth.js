const express = require('express');

const app = express.Router();

const {SignUp, Login, userDetails, logout, allUsers, updateUser} = require("../controller/user");
const { isAuthenticated } = require('../middlerware/auth');

app.post("/signup", SignUp);
app.post("/login", Login);
app.get("/logout",isAuthenticated, logout);
app.get("/user-details",isAuthenticated, userDetails);
app.get("/all-users",isAuthenticated, allUsers);
app.post("/update-user",isAuthenticated, updateUser);

module.exports = app;