import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: function() {
        // Age is required only for regular users, not for admins
        return this.role === 'user';
      },
      min: 1, // Ensures age is a positive number
    },
    gender: {
      type: String,
      required: function() {
        // Gender is required only for regular users, not for admins
        return this.role === 'user';
      },
      enum: ["Male", "Female", "Other"], // Restricts to these values
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"], // Restricts to these roles
      default: "user"
    },
    cartData: {
      type: Object,
      default: {},
    },
    // Optional: Add timestamps for user creation and updates
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { 
    minimize: false,
    // This will automatically add createdAt and updatedAt fields
    timestamps: true
  }
);

// Pre-save middleware to update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-update middleware to update the updatedAt field
userSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;