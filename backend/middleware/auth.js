import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Add user info to request body for controller access
    req.body.userId = decoded.id;
    req.body.userRole = decoded.role;
    
    // Also add to req.user for potential future use
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Token has expired. Please login again." 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token. Access denied." 
      });
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during authentication." 
    });
  }
};

export default authMiddleware;