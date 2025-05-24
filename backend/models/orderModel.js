import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
});

const OrderItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [OrderItemSchema], required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true, default: "Food Processing" },
  address: { type: AddressSchema, required: true },
  date: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  orderId: { type: String }, // Razorpay Order ID
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
