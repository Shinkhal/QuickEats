import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNo: { type: String, required: true },
  query: { type: String, required: true },
  expertise: { type: String, enum: ['Chef', 'Food Safety Expert', 'Food Quality Check'], required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }
}, { timestamps: true });

const Query = mongoose.model('Query', querySchema);
export default Query;