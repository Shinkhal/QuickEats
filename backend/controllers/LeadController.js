import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import Lead from "../models/DataModel.js";
import { predictLeadQuality } from "./aiModel.js";

/**
 * Generate AI-enhanced lead data for a user
 * @param {String} userId - User's ID
 */
export async function generateLeadData(userId) {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            console.log("User not found");
            return;
        }

        const userOrders = await orderModel.find({ userId });
        const orderFrequency = userOrders.length;
        const totalCartItems = user.cartData ? Object.keys(user.cartData).length : 0;
        const totalOrderedItems = userOrders.reduce((sum, order) => sum + (order.items ? order.items.length : 0), 0);
        const cartAbandonmentRate = totalCartItems > 0 ? ((totalCartItems - totalOrderedItems) / totalCartItems) * 100 : 0;
        const sessionDuration = Math.floor(Math.random() * 300) + 100; // Simulated session duration

        const leadScore = predictLeadQuality(orderFrequency, cartAbandonmentRate, sessionDuration);
        const leadQuality = leadScore > 80 ? "High" : leadScore > 50 ? "Medium" : "Low";

        await Lead.findOneAndUpdate(
            { userId },
            { userId, sessionDuration, orderFrequency, cartAbandonmentRate, leadScore, leadQuality },
            { upsert: true, new: true }
        );

        console.log(`AI-Enhanced Lead Data Generated for User ID: ${userId}`);
    } catch (error) {
        console.error("Error generating lead data:", error);
    }
}

/**
 * Fetch all users, calculate lead scores, and update them in the schema
 */
export async function fetchAndUpdateAllUserLeadScores() {
    try {
        const users = await userModel.find({}, { _id: 1 });

        for (const user of users) {
            await generateLeadData(user._id);
        }

        console.log("All user lead scores updated successfully.");

        // Fetch updated leads after updating scores
        const updatedLeads = await userModel.find({}, { _id: 1, name: 1, email: 1, leadScore: 1 });

        return updatedLeads; // Ensure the function returns an array of leads
    } catch (error) {
        console.error("Error fetching and updating user lead scores:", error);
        return []; // Return an empty array on failure
    }
}
