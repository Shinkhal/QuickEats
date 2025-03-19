import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { sendEmail } from "../utils/emailSender.js";

// Login user
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

    // Generate token
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "2d" });
};

// Register user
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

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
    });

    const user = await newUser.save(); // Save user first

    // Generate token
    const token = createToken(user._id);

    // Send welcome email (shouldn't block response)
    try {
      const emailSubject = "Welcome to Quick Eats!";
const upperCaseName = name.toUpperCase();
const emailMessage = `Dear ${upperCaseName},  

Welcome to Quick Eats!  

We are thrilled to have you join our community of food lovers. At Quick Eats, we are dedicated to bringing you a seamless and delightful dining experience, whether you’re craving comfort food, gourmet dishes, or a quick bite on the go.  

Explore our diverse menu, discover exciting flavors, and enjoy the convenience of ordering your favorite meals with just a few clicks. Our team is committed to delivering fresh, delicious food straight to your doorstep.  

If you ever need assistance or have any questions, our support team is always here to help.  

Thank you for choosing Quick Eats. We look forward to serving you!  

Best regards,  
The Quick Eats Team  
📧 Contact Support: support@quickeats.com  
📞 Customer Service: +91 9936165538`;


      await sendEmail(email, emailSubject, emailMessage);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { registerUser, loginUser };
