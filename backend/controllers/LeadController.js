// LeadController.js
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import Lead from "../models/DataModel.js";
import { predictLeadQuality } from "./aiModel.js";
import mongoose from "mongoose";

/**
 * Generate AI-enhanced lead data for a specific user
 */
export async function generateLeadData(userId) {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid user ID format: ${userId}`);
    }

    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error(`User not found for ID: ${userId}`);
    }

    const orders = await orderModel.find({ userId });
    const orderFrequency = orders.length;

    const cartItems = user.cartData || {};
    const totalCartItems = Object.values(cartItems).reduce((sum, qty) => sum + (qty || 0), 0);

    const totalOrderedItems = orders.reduce(
      (sum, order) => sum + (order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0),
      0
    );

    const cartAbandonmentRate = totalCartItems > 0
      ? Math.min(100, Math.max(0, ((totalCartItems - totalOrderedItems) / totalCartItems) * 100))
      : 0;

    // Generate more realistic session duration based on user activity
    const baseSessionTime = orderFrequency > 0 ? 200 : 100;
    const sessionDuration = Math.floor(Math.random() * 200) + baseSessionTime;

    const leadScore = predictLeadQuality(orderFrequency, cartAbandonmentRate, sessionDuration);
    const leadQuality = leadScore > 80 ? "High" : leadScore > 50 ? "Medium" : "Low";

    const updatedLead = await Lead.findOneAndUpdate(
      { userId },
      {
        userId,
        sessionDuration,
        orderFrequency,
        cartAbandonmentRate: Math.round(cartAbandonmentRate * 100) / 100, // Round to 2 decimal places
        leadScore,
        leadQuality,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Lead data generated for User ID: ${userId}`);
    return updatedLead;
  } catch (error) {
    console.error(`❌ Error generating lead data for user ${userId}:`, error.message);
    throw error;
  }
}

/**
 * Fetch all leads with populated user data - Enhanced to show all users with scores
 */
export async function getAllLeads() {
  try {
    // Get all users first
    const allUsers = await userModel.find({}, 'name email').lean();
    
    if (allUsers.length === 0) {
      return {
        success: true,
        count: 0,
        leads: [],
        message: "No users found in the system"
      };
    }

    // Get existing leads
    const existingLeads = await Lead.find().lean();
    const leadMap = new Map(existingLeads.map(lead => [lead.userId.toString(), lead]));

    const formattedLeads = [];

    for (const user of allUsers) {
      const userId = user._id.toString();
      let leadData = leadMap.get(userId);

      // If no lead data exists for this user, generate it
      if (!leadData) {
        try {
          leadData = await generateLeadData(user._id);
          console.log(`Generated lead data for user: ${user.name}`);
        } catch (error) {
          console.error(`Failed to generate lead for user ${user.name}:`, error.message);
          // Create default lead data if generation fails
          leadData = {
            _id: new mongoose.Types.ObjectId(),
            userId: user._id,
            leadScore: 0,
            leadQuality: 'Low',
            sessionDuration: 0,
            cartAbandonmentRate: 0,
            orderFrequency: 0,
            updatedAt: new Date()
          };
        }
      }

      formattedLeads.push({
        leadId: leadData._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        leadScore: leadData.leadScore || 0,
        leadQuality: leadData.leadQuality || 'Low',
        sessionDuration: leadData.sessionDuration || 0,
        cartAbandonmentRate: leadData.cartAbandonmentRate || 0,
        orderFrequency: leadData.orderFrequency || 0,
        updatedAt: leadData.updatedAt || new Date()
      });
    }

    // Sort by lead score (highest first)
    formattedLeads.sort((a, b) => b.leadScore - a.leadScore);

    return {
      success: true,
      count: formattedLeads.length,
      leads: formattedLeads,
      message: `Found ${formattedLeads.length} users with lead scores`
    };
  } catch (error) {
    console.error("❌ Error fetching leads:", error.message);
    throw error;
  }
}



/**
 * Update lead scores for all users (optional batch operation)
 */
export async function updateAllUserLeadScores() {
  try {
    const users = await userModel.find({}, "_id").lean();
    const results = [];
    const errors = [];

    for (const user of users) {
      try {
        await generateLeadData(user._id);
        results.push(user._id);
      } catch (error) {
        errors.push({ userId: user._id, error: error.message });
      }
    }

    console.log(`✅ Updated ${results.length} user lead scores. ${errors.length} errors.`);
    
    if (errors.length > 0) {
      console.warn("Errors during batch update:", errors);
    }

    // Return updated leads in the same format as getAllLeads
    const updatedLeadsData = await getAllLeads();
    
    return {
      success: true,
      message: `Updated ${results.length} lead scores successfully`,
      data: {
        leads: updatedLeadsData.leads,
        processed: results.length,
        errors: errors.length
      }
    };
  } catch (error) {
    console.error("❌ Error in batch update:", error.message);
    throw error;
  }
}

/**
 * Generate lead for a single user - API endpoint function
 */
export async function generateSingleLead(userId) {
  try {
    const updatedLead = await generateLeadData(userId);
    
    // Get user data to return complete lead info
    const user = await userModel.findById(userId, 'name email');
    
    return {
      success: true,
      message: "Lead data generated successfully",
      data: {
        leadId: updatedLead._id,
        userId: updatedLead.userId,
        name: user.name,
        email: user.email,
        leadScore: updatedLead.leadScore,
        leadQuality: updatedLead.leadQuality,
        sessionDuration: updatedLead.sessionDuration,
        cartAbandonmentRate: updatedLead.cartAbandonmentRate,
        orderFrequency: updatedLead.orderFrequency,
        updatedAt: updatedLead.updatedAt
      }
    };
  } catch (error) {
    console.error(`❌ Error generating single lead for user ${userId}:`, error.message);
    throw error;
  }
}