import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sessionDuration: { type: Number, required: true },
  orderFrequency: { type: Number, required: true },
  cartAbandonmentRate: { type: Number, required: true },
  leadScore: { type: Number },
  leadQuality: { type: String },
});

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;