import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { sendEmail } from "../utils/emailSender.js";

// Login user (both regular and admin)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User Doesn't Exist" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate token with user role
    const token = createToken(user._id, user.role);
    
    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin login (separate endpoint for admin panel)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists and is an admin
    const user = await userModel.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin account not found" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid admin credentials" });
    }

    // Generate token
    const token = createToken(user._id, user.role);
    
    res.json({ 
      success: true, 
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create Token with role
const createToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.SECRET_KEY, { expiresIn: "7d" });
};

// Register regular user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    // Check if the user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate strong password
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    // Validate age (must be a number and greater than 0)
    if (!age || isNaN(age) || age < 1) {
      return res.status(400).json({ success: false, message: "Please enter a valid age" });
    }

    // Validate gender (must be "Male", "Female", or "Other")
    const allowedGenders = ["Male", "Female", "Other"];
    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({ success: false, message: "Please select a valid gender" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user - role is automatically set to 'user' by default in schema
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      age,
      gender
      // No need to specify role - it defaults to 'user' in the schema
    });

    const user = await newUser.save();

    // Generate token
    const token = createToken(user._id, user.role);

    // Send welcome email (shouldn't block response)
    try {
      const emailSubject = "Welcome to Quick Eats!";
      const upperCaseName = name.toUpperCase();
      const emailMessage = `Dear ${upperCaseName},  

Welcome to Quick Eats!  

We are thrilled to have you join our community of food lovers. At Quick Eats, we are dedicated to bringing you a seamless and delightful dining experience, whether you're craving comfort food, gourmet dishes, or a quick bite on the go.  

**To receive updates and support via WhatsApp, please join our WhatsApp channel:**  
👉 <a href="https://wa.me/14155238886?text=join%20factory-wealth">Click here to join on WhatsApp</a>  
Or send the message <b>join factory-wealth</b> to <b>+1 415 523 8886</b> on WhatsApp.

Explore our diverse menu, discover exciting flavors, and enjoy the convenience of ordering your favorite meals with just a few clicks. Our team is committed to delivering fresh, delicious food straight to your doorstep.  

If you ever need assistance or have any questions, our support team is always here to help.  

Thank you for choosing Quick Eats. We look forward to serving you!  

Best regards,  
The Quick Eats Team  
📧 Contact Support: support@quickeats.com `;

      await sendEmail(email, emailSubject, emailMessage);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
        // Don't expose role to regular users in response
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Register admin user
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate strong password
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin user
    const newAdmin = new userModel({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
      // Admin users don't need age and gender due to conditional validation
    });

    const admin = await newAdmin.save();

    // Generate token
    const token = createToken(admin._id, admin.role);

    // Send admin welcome email
    try {
      const emailSubject = "Welcome to Quick Eats Admin Panel!";
      const upperCaseName = name.toUpperCase();
      const emailMessage = `Dear ${upperCaseName},  

Welcome to the Quick Eats Admin Panel!  

Your administrator account has been successfully created. You now have access to the admin dashboard where you can:

• Manage orders and track deliveries
• Handle customer queries and support
• Manage menu items and inventory
• View analytics and reports
• Oversee user accounts and leads

**Important Security Notes:**
- Keep your admin credentials secure
- Log out after each session
- Report any suspicious activity immediately

Access your admin panel at: ${process.env.ADMIN_PANEL_URL || 'https://admin.quickeats.com'}

If you have any questions or need technical support, please contact our development team.

Best regards,  
The Quick Eats Development Team  
📧 Admin Support: admin-support@quickeats.com `;

      await sendEmail(email, emailSubject, emailMessage);
    } catch (emailError) {
      console.error("Failed to send admin email:", emailError);
    }

    res.json({ 
      success: true, 
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({ role: 'user' }).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select('-password -role');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password;
    delete updates.role;
    delete updates.userId;

    const user = await userModel.findByIdAndUpdate(
      userId, 
      updates, 
      { new: true, select: '-password -role' }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Validate new password
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { 
  registerUser, 
  loginUser, 
  registerAdmin, 
  loginAdmin,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  changePassword
};