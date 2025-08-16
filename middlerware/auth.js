const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies?.token;

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Token is missing.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    // console.log("decode",decoded);
    req.user = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid or expired token.",
      error: error.message,
    });
  }
};



const isAdmin = async (req, res, next) => {
	try {
    const userId = req.user || req.user._id;
		const role = await User.findById(userId);

		if (role?.role !== "ADMIN") {
			return res.status(401).json({
				success: false,
				message: "Product upload only Admin",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({ 
         success: false, 
         message: `Admin Role Can't be Verified` });
	}
};

module.exports = { isAuthenticated , isAdmin};
