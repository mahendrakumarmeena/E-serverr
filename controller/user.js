const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = require("../models/user"); // adjust the path as needed

const SignUp = async(req, res) => {
  try {
    const { name, password, email, profilePic } = req.body; // ✅ Include profilePic

    // Validate required fields
    if (!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, email, password).",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please sign in.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "GENERAL",
      profilePic, // ✅ Save profilePic from body
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profilePic: newUser.profilePic,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please sign up.",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Set cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: "strict",
    };

    // Send response
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "Login successful.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const userDetails = async (req, res) => {
  try {

    
    const userId = req.user || req.user._id; // Adjust based on how JWT stores user ID

    const user = await User.findById(userId).select("-password"); // Exclude password for security

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const allUsers = async(req, res)=>{
  try{
        // const userId = req.user || req.user._id;
        const allUser =  await User.find();
        // console.log("all user data",allUser);

        return res.status(200).json({
          success:true,
          message:"fetch user data",
          data:allUser,
        });
  }catch(error){
    return res.status(500).json({
      success:false,
      error:error.message,
      message:"Internal server error",
    })
  }
}


const logout = async(req, res)=>{
  try{
      res.clearCookie("token");

      res.status(200).json({
        success:true,
        message:"Logged Out Successfully",
        data:[],
      })
  }catch(error){
    res.status(500).json({
      success:false,
      message:"Internal server error",
      error:error.message,
    })
  }
}

const updateUser = async(req, res)=>{
    try{
          const sessionUser = req.user || req.user._id;

          const {userId, name , email, role} = req.body;

          const payload = {
            ...(email && {email : email}),
            ...(name && {name : name}),
            ...(role && {role : role}),
          }


          const user = await User.findById(sessionUser)


          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: payload },
            { new: true }
          );

          return res.status(200).json({
             message:"User Role Updated Successfully",
             success:true,
             data:updatedUser,
          })
    }catch(error){
        res.status(500).json({
           success:false,
           message:"Internal server error",
           error:error.message,
        })
    }
}

module.exports = {SignUp, Login, userDetails, logout, allUsers, updateUser};