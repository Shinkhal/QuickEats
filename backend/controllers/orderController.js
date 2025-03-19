import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendEmail } from "../utils/emailSender.js";

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

// Placing a new order
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    
    try {
        const { userId, items, amount, address } = req.body;

        if (!userId || !items || items.length === 0 || !amount || !address) {
            return res.status(400).json({ success: false, message: "Missing required order details" });
        }

        // Create a new order in the database
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            status: "Food Processing", // Default status
            paymentStatus: "Pending"   // Default payment status
        });

        await newOrder.save();

        // Clear the user's cart after placing the order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Convert amount to paise (Razorpay requires this)
        const totalAmount = amount * 100;

        // Razorpay Order Options
        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: `order_rcptid_${newOrder._id}`,
            payment_capture: 1
        };

        // Create Razorpay order
        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Send order confirmation email
        const emailSubject = "Order Confirmation - Your Order Has Been Placed!";
        const emailText = `Dear ${address.firstName},  
        
        Thank you for your order! We are pleased to inform you that your order of ₹${amount} has been successfully placed.  

        Order Details:  
        - Order ID: ${newOrder._id}  
        - Total Amount: ₹${amount}  

        We will notify you as soon as your order is out for delivery.  

        If you have any questions or need assistance, feel free to reach out to our support team.  

        Thank you for choosing Quick Eats—we look forward to serving you!  

        Best regards,  
        The Quick Eats Team  
        Contact Support: support@quickeats.com  
        Customer Service: +91 9936165538`;


        await sendEmail(address.email, emailSubject, emailText);

        // Send response with Razorpay payment details
        res.status(200).json({
            success: true,
            msg: "Order Created",
            ord_id: newOrder._id,
            order_id: razorpayOrder.id,
            amount: totalAmount,
            key_id: process.env.RAZORPAY_KEY_ID,
            product_name: items.map(item => item.name).join(", "),
            description: "Order payment for products",
            name: `${address.firstName} ${address.lastName}`,
            email: address.email,
            contact: address.phone,
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });
        
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error placing the order" });
    }
};


// Verify Razorpay Payment
const verifyOrder = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
            return res.status(400).json({ success: false, message: "Invalid request parameters" });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Update payment status in database
            await orderModel.findByIdAndUpdate(order_id, { 
                paymentStatus: "Completed",
                razorpay_payment_id,
                razorpay_signature
            });

            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

// Mark Order as Verified
const verifiedOrder = async (req, res) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        await orderModel.findByIdAndUpdate(order_id, { paymentStatus: "Completed" });

        res.status(200).json({ success: true, message: "Order updated successfully" });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Fetch Orders for a User
// Fetch Orders for a Specific User
const usersOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const orders = await orderModel.find({ userId });

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Fetch All Orders for Admin Panel
const listOrder = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error listing orders:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update Order Status (Admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const validStatuses = ["Food Processing", "Out for Delivery", "Delivered", "Cancelled"];
        if (!orderId || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status or order ID" });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });

        res.status(200).json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { placeOrder, verifyOrder, verifiedOrder, usersOrders, listOrder, updateStatus };
